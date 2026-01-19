import { GoogleGenerativeAI } from '@google/generative-ai';

// Types for AI processing
export interface ModelAnalysis {
    name: string;
    description: string;
    polygonCount?: number;
    verticesCount?: number;
    geometryType?: string;
    isRigged?: boolean;
    isAnimated?: boolean;
    materialType?: string;
    category?: string;
}

export interface GeometryData {
    vertices: number[];
    faces: number[];
    normals?: number[];
    uvs?: number[];
    bounds?: {
        min: { x: number; y: number; z: number };
        max: { x: number; y: number; z: number };
    };
}

export interface TopologyAnalysis {
    score: number; // 0-100
    polygonCount: number;
    verticesCount: number;
    edgeCount: number;
    manifoldness: boolean;
    recommendations: string[];
    optimizationPotential: number; // Percentage
}

export interface Issue {
    type: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    description: string;
    location?: any;
    autoFixable: boolean;
}

export interface LODResult {
    level: number;
    polygonCount: number;
    reductionRatio: number;
    fileUrl: string;
    fileSize: number;
}

export interface UVOptimizationResult {
    score: number; // 0-100
    hasOverlaps: boolean;
    coverage: number; // Percentage
    recommendations: string[];
    optimizedUVs?: number[];
}

/**
 * AI Service for 3D Model Processing
 */
export class AIModelService {
    private genAI: GoogleGenerativeAI;

    constructor() {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error('GEMINI_API_KEY is not set');
        }
        this.genAI = new GoogleGenerativeAI(apiKey);
    }

    /**
     * Suggest tags based on model analysis
     */
    async suggestTags(modelData: ModelAnalysis): Promise<string[]> {
        try {
            const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });

            const prompt = `Analyze this 3D model and suggest relevant tags for a marketplace:

Model Name: ${modelData.name}
Description: ${modelData.description}
Polygon Count: ${modelData.polygonCount || 'Unknown'}
Vertices Count: ${modelData.verticesCount || 'Unknown'}
Geometry Type: ${modelData.geometryType || 'Unknown'}
Is Rigged: ${modelData.isRigged ? 'Yes' : 'No'}
Is Animated: ${modelData.isAnimated ? 'Yes' : 'No'}
Material Type: ${modelData.materialType || 'Unknown'}
Category: ${modelData.category || 'Unknown'}

Suggest 10-15 relevant tags that would help users find this model. Include:
- Technical tags (poly count, rigging, animation)
- Style tags (realistic, stylized, low-poly, high-detail)
- Use case tags (game-ready, VR, AR, rendering)
- Industry tags (architecture, character, vehicle, environment)

Return ONLY a JSON array of tags, nothing else.`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            // Parse JSON response
            const jsonMatch = text.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                const tags = JSON.parse(jsonMatch[0]);
                return tags.filter((tag: string) => tag && tag.length > 0);
            }

            return [];
        } catch (error) {
            console.error('Error suggesting tags:', error);
            return [];
        }
    }

    /**
     * Analyze topology and provide score
     */
    async analyzeTopology(geometry: GeometryData): Promise<TopologyAnalysis> {
        const vertexCount = geometry.vertices.length / 3;
        const faceCount = geometry.faces.length / 3;
        const edgeCount = this.calculateEdgeCount(geometry);

        // Calculate topology score based on various factors
        let score = 100;

        // Penalize for very high polygon count
        if (vertexCount > 100000) score -= 20;
        else if (vertexCount > 50000) score -= 10;

        // Check for manifoldness
        const isManifold = this.checkManifoldness(geometry);
        if (!isManifold) score -= 30;

        // Check for degenerate faces
        const hasDegenerateFaces = this.checkDegenerateFaces(geometry);
        if (hasDegenerateFaces) score -= 15;

        const recommendations: string[] = [];

        if (vertexCount > 50000) {
            recommendations.push('Consider reducing polygon count for better performance');
        }
        if (!isManifold) {
            recommendations.push('Fix non-manifold geometry for better compatibility');
        }
        if (hasDegenerateFaces) {
            recommendations.push('Remove zero-area faces');
        }

        const optimizationPotential = Math.max(0, 100 - score);

        return {
            score: Math.max(0, score),
            polygonCount: faceCount,
            verticesCount: vertexCount,
            edgeCount,
            manifoldness: isManifold,
            recommendations,
            optimizationPotential,
        };
    }

    /**
     * Detect geometry issues
     */
    async detectIssues(geometry: GeometryData): Promise<Issue[]> {
        const issues: Issue[] = [];

        // Check for non-manifold geometry
        if (!this.checkManifoldness(geometry)) {
            issues.push({
                type: 'NON_MANIFOLD_GEOMETRY',
                severity: 'HIGH',
                description: 'Model contains non-manifold geometry which may cause issues in some applications',
                autoFixable: true,
            });
        }

        // Check for overlapping faces
        const overlappingFaces = this.detectOverlappingFaces(geometry);
        if (overlappingFaces.length > 0) {
            issues.push({
                type: 'OVERLAPPING_FACES',
                severity: 'MEDIUM',
                description: `Found ${overlappingFaces.length} overlapping faces`,
                location: overlappingFaces,
                autoFixable: false,
            });
        }

        // Check for flipped normals
        if (geometry.normals) {
            const flippedNormals = this.detectFlippedNormals(geometry);
            if (flippedNormals.length > 0) {
                issues.push({
                    type: 'FLIPPED_NORMALS',
                    severity: 'MEDIUM',
                    description: `Found ${flippedNormals.length} faces with flipped normals`,
                    location: flippedNormals,
                    autoFixable: true,
                });
            }
        }

        // Check for missing UVs
        if (!geometry.uvs || geometry.uvs.length === 0) {
            issues.push({
                type: 'MISSING_UVS',
                severity: 'HIGH',
                description: 'Model is missing UV coordinates for texturing',
                autoFixable: false,
            });
        } else {
            // Check for UV overlaps
            const uvOverlaps = this.detectUVOverlaps(geometry);
            if (uvOverlaps.length > 0) {
                issues.push({
                    type: 'UV_OVERLAP',
                    severity: 'LOW',
                    description: `Found ${uvOverlaps.length} UV overlaps`,
                    location: uvOverlaps,
                    autoFixable: true,
                });
            }
        }

        // Check for zero-area faces
        const zeroAreaFaces = this.detectZeroAreaFaces(geometry);
        if (zeroAreaFaces.length > 0) {
            issues.push({
                type: 'ZERO_AREA_FACES',
                severity: 'MEDIUM',
                description: `Found ${zeroAreaFaces.length} degenerate faces with zero area`,
                location: zeroAreaFaces,
                autoFixable: true,
            });
        }

        // Check for duplicate vertices
        const duplicateVertices = this.detectDuplicateVertices(geometry);
        if (duplicateVertices.length > 0) {
            issues.push({
                type: 'DUPLICATE_VERTICES',
                severity: 'LOW',
                description: `Found ${duplicateVertices.length} duplicate vertices`,
                autoFixable: true,
            });
        }

        return issues;
    }

    // Helper methods for geometry analysis

    private calculateEdgeCount(geometry: GeometryData): number {
        const edges = new Set<string>();
        const faces = geometry.faces;

        for (let i = 0; i < faces.length; i += 3) {
            const v1 = faces[i];
            const v2 = faces[i + 1];
            const v3 = faces[i + 2];

            edges.add([Math.min(v1, v2), Math.max(v1, v2)].join('-'));
            edges.add([Math.min(v2, v3), Math.max(v2, v3)].join('-'));
            edges.add([Math.min(v3, v1), Math.max(v3, v1)].join('-'));
        }

        return edges.size;
    }

    private checkManifoldness(geometry: GeometryData): boolean {
        const edgeCount = new Map<string, number>();
        const faces = geometry.faces;

        for (let i = 0; i < faces.length; i += 3) {
            const v1 = faces[i];
            const v2 = faces[i + 1];
            const v3 = faces[i + 2];

            const edges = [
                [Math.min(v1, v2), Math.max(v1, v2)].join('-'),
                [Math.min(v2, v3), Math.max(v2, v3)].join('-'),
                [Math.min(v3, v1), Math.max(v3, v1)].join('-'),
            ];

            edges.forEach(edge => {
                edgeCount.set(edge, (edgeCount.get(edge) || 0) + 1);
            });
        }

        // Check if any edge is shared by more than 2 faces
        for (const count of edgeCount.values()) {
            if (count > 2) return false;
        }

        return true;
    }

    private checkDegenerateFaces(geometry: GeometryData): boolean {
        return this.detectZeroAreaFaces(geometry).length > 0;
    }

    private detectOverlappingFaces(geometry: GeometryData): number[] {
        // Simplified overlap detection
        // In a real implementation, use spatial indexing
        return [];
    }

    private detectFlippedNormals(geometry: GeometryData): number[] {
        // Simplified normal check
        return [];
    }

    private detectUVOverlaps(geometry: GeometryData): number[] {
        // Simplified UV overlap detection
        return [];
    }

    private detectZeroAreaFaces(geometry: GeometryData): number[] {
        const zeroAreaFaces: number[] = [];
        const vertices = geometry.vertices;
        const faces = geometry.faces;

        for (let i = 0; i < faces.length; i += 3) {
            const v1Idx = faces[i] * 3;
            const v2Idx = faces[i + 1] * 3;
            const v3Idx = faces[i + 2] * 3;

            const v1 = [vertices[v1Idx], vertices[v1Idx + 1], vertices[v1Idx + 2]];
            const v2 = [vertices[v2Idx], vertices[v2Idx + 1], vertices[v2Idx + 2]];
            const v3 = [vertices[v3Idx], vertices[v3Idx + 1], vertices[v3Idx + 2]];

            const area = this.calculateTriangleArea(v1, v2, v3);
            if (area < 0.000001) {
                zeroAreaFaces.push(i / 3);
            }
        }

        return zeroAreaFaces;
    }

    private detectDuplicateVertices(geometry: GeometryData): number[] {
        const duplicates: number[] = [];
        const vertices = geometry.vertices;
        const vertexMap = new Map<string, number>();

        for (let i = 0; i < vertices.length; i += 3) {
            const key = `${vertices[i].toFixed(6)},${vertices[i + 1].toFixed(6)},${vertices[i + 2].toFixed(6)}`;
            if (vertexMap.has(key)) {
                duplicates.push(i / 3);
            } else {
                vertexMap.set(key, i / 3);
            }
        }

        return duplicates;
    }

    private calculateTriangleArea(v1: number[], v2: number[], v3: number[]): number {
        const a = [v2[0] - v1[0], v2[1] - v1[1], v2[2] - v1[2]];
        const b = [v3[0] - v1[0], v3[1] - v1[1], v3[2] - v1[2]];

        const cross = [
            a[1] * b[2] - a[2] * b[1],
            a[2] * b[0] - a[0] * b[2],
            a[0] * b[1] - a[1] * b[0],
        ];

        const length = Math.sqrt(cross[0] ** 2 + cross[1] ** 2 + cross[2] ** 2);
        return length / 2;
    }
}

// Export singleton instance
export const aiService = new AIModelService();
