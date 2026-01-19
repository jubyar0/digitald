'use client';

import { Suspense, useRef, useState } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Grid, Environment } from '@react-three/drei';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as THREE from 'three';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Maximize2, Minimize2, Grid3x3, Box, Sun, Moon } from 'lucide-react';

interface ModelViewerProps {
    modelUrl: string;
    className?: string;
    showControls?: boolean;
    autoRotate?: boolean;
}

function Model({ url }: { url: string }) {
    const gltf = useLoader(GLTFLoader, url);
    const meshRef = useRef<THREE.Group>(null);

    useFrame(() => {
        if (meshRef.current) {
            // Optional: Add any animations here
        }
    });

    return <primitive ref={meshRef} object={gltf.scene} />;
}

function ModelStats({ modelUrl }: { modelUrl: string }) {
    const [stats, setStats] = useState({ polygons: 0, vertices: 0 });

    // This would be calculated from the loaded model
    // For now, it's a placeholder
    return (
        <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2">
                <Box className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Polygons:</span>
                <span className="font-medium">{stats.polygons.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2">
                <Grid3x3 className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Vertices:</span>
                <span className="font-medium">{stats.vertices.toLocaleString()}</span>
            </div>
        </div>
    );
}

export function ModelViewer({
    modelUrl,
    className = '',
    showControls = true,
    autoRotate = false
}: ModelViewerProps) {
    const [wireframe, setWireframe] = useState(false);
    const [showGrid, setShowGrid] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [lightMode, setLightMode] = useState<'bright' | 'dark'>('bright');
    const containerRef = useRef<HTMLDivElement>(null);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            containerRef.current?.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle>3D Model Preview</CardTitle>
                <CardDescription>Interactive 3D model viewer</CardDescription>
            </CardHeader>
            <CardContent>
                <div
                    ref={containerRef}
                    className="relative w-full h-[500px] bg-gradient-to-b from-background to-muted rounded-lg overflow-hidden"
                >
                    <Canvas shadows>
                        <PerspectiveCamera makeDefault position={[5, 5, 5]} />

                        {/* Lighting */}
                        <ambientLight intensity={lightMode === 'bright' ? 0.5 : 0.2} />
                        <directionalLight
                            position={[10, 10, 5]}
                            intensity={lightMode === 'bright' ? 1 : 0.5}
                            castShadow
                        />
                        <pointLight position={[-10, -10, -10]} intensity={0.3} />

                        {/* Environment */}
                        <Environment preset={lightMode === 'bright' ? 'sunset' : 'night'} />

                        {/* Grid */}
                        {showGrid && (
                            <Grid
                                args={[10, 10]}
                                cellSize={0.5}
                                cellThickness={0.5}
                                cellColor="#6b7280"
                                sectionSize={1}
                                sectionThickness={1}
                                sectionColor="#374151"
                                fadeDistance={25}
                                fadeStrength={1}
                                followCamera={false}
                            />
                        )}

                        {/* Model */}
                        <Suspense fallback={null}>
                            <Model url={modelUrl} />
                        </Suspense>

                        {/* Controls */}
                        <OrbitControls
                            autoRotate={autoRotate}
                            autoRotateSpeed={2}
                            enableDamping
                            dampingFactor={0.05}
                        />
                    </Canvas>

                    {/* Control Panel */}
                    {showControls && (
                        <div className="absolute top-4 right-4 flex flex-col gap-2">
                            <Button
                                size="icon"
                                variant="secondary"
                                onClick={() => setWireframe(!wireframe)}
                                title="Toggle Wireframe"
                            >
                                <Grid3x3 className="h-4 w-4" />
                            </Button>
                            <Button
                                size="icon"
                                variant="secondary"
                                onClick={() => setShowGrid(!showGrid)}
                                title="Toggle Grid"
                            >
                                <Box className="h-4 w-4" />
                            </Button>
                            <Button
                                size="icon"
                                variant="secondary"
                                onClick={() => setLightMode(lightMode === 'bright' ? 'dark' : 'bright')}
                                title="Toggle Lighting"
                            >
                                {lightMode === 'bright' ? (
                                    <Moon className="h-4 w-4" />
                                ) : (
                                    <Sun className="h-4 w-4" />
                                )}
                            </Button>
                            <Button
                                size="icon"
                                variant="secondary"
                                onClick={toggleFullscreen}
                                title="Toggle Fullscreen"
                            >
                                {isFullscreen ? (
                                    <Minimize2 className="h-4 w-4" />
                                ) : (
                                    <Maximize2 className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                    )}

                    {/* Loading Indicator */}
                    <div className="absolute bottom-4 left-4 bg-background/80 backdrop-blur-sm rounded-lg p-3">
                        <ModelStats modelUrl={modelUrl} />
                    </div>
                </div>

                {/* Instructions */}
                <div className="mt-4 text-sm text-muted-foreground">
                    <p>
                        <strong>Controls:</strong> Left click + drag to rotate • Right click + drag to pan • Scroll to zoom
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
