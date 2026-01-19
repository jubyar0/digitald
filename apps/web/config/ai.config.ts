/**
 * AI Configuration
 */

export const aiConfig = {
    // Enable/disable AI features
    enabled: process.env.NEXT_PUBLIC_AI_PROCESSING_ENABLED === 'true' || true,

    // Google Gemini API
    geminiApiKey: process.env.GEMINI_API_KEY || '',

    // File processing limits
    maxFileSize: parseInt(process.env.AI_MAX_FILE_SIZE_MB || '100') * 1024 * 1024, // Convert to bytes

    // Thumbnail generation settings
    thumbnail: {
        width: parseInt(process.env.AI_THUMBNAIL_WIDTH || '800'),
        height: parseInt(process.env.AI_THUMBNAIL_HEIGHT || '600'),
        quality: 0.9,
        format: 'image/png' as const,
        cameraAngles: ['front', 'side', 'top', 'perspective'] as const,
        backgroundColor: '#f0f0f0',
    },

    // Supported 3D file formats
    supportedFormats: [
        'gltf',
        'glb',
        'obj',
        'fbx',
        'stl',
        'dae',
        'ply',
        '3ds',
    ] as const,

    // LOD generation settings
    lod: {
        levels: [0.75, 0.5, 0.25, 0.1], // Reduction ratios
        defaultLevels: 3,
        minPolygons: 100, // Minimum polygons for lowest LOD
    },

    // Topology analysis thresholds
    topology: {
        excellentScore: 90,
        goodScore: 70,
        fairScore: 50,
        maxPolygons: 100000,
        maxVertices: 100000,
    },

    // UV optimization settings
    uv: {
        targetCoverage: 0.85, // 85% UV space coverage
        maxOverlap: 0.05, // 5% acceptable overlap
    },

    // Issue detection settings
    issues: {
        checkNonManifold: true,
        checkOverlappingFaces: true,
        checkFlippedNormals: true,
        checkMissingUVs: true,
        checkUVOverlaps: true,
        checkZeroAreaFaces: true,
        checkDuplicateVertices: true,
        checkIsolatedVertices: true,
    },

    // Processing timeouts (in milliseconds)
    timeouts: {
        thumbnail: 30000, // 30 seconds
        topology: 60000, // 1 minute
        tagSuggestion: 30000, // 30 seconds
        issueDetection: 120000, // 2 minutes
        lodGeneration: 180000, // 3 minutes
        uvOptimization: 120000, // 2 minutes
    },
} as const

export type AIConfig = typeof aiConfig
export type SupportedFormat = typeof aiConfig.supportedFormats[number]
export type CameraAngle = typeof aiConfig.thumbnail.cameraAngles[number]
