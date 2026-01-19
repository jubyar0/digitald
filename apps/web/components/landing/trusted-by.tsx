"use client";

export function TrustedBy() {
    const companies = [
        { name: "Canva", color: "text-cyan-400" },
        { name: "NVIDIA", color: "text-green-400" },
        { name: "Adobe", color: "text-red-400" },
        { name: "IKEA", color: "text-yellow-400" },
        { name: "Meta", color: "text-blue-400" },
        { name: "Sony", color: "text-purple-400" }
    ];

    return (
        <section className="bg-[#111] py-20 border-y border-white/5">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        A library of 5,000+ 3D assets crafted by experts
                    </h2>
                    <p className="text-xl text-gray-400">
                        Trusted by artists at the world's leading companies
                    </p>
                </div>

                <div className="flex flex-wrap justify-center items-center gap-12 md:gap-16">
                    {companies.map((company, index) => (
                        <div
                            key={index}
                            className="group relative"
                        >
                            <div className={`text-2xl md:text-3xl font-bold ${company.color} opacity-40 group-hover:opacity-100 transition-opacity duration-300`}>
                                {company.name}
                            </div>

                            {/* Glow effect on hover */}
                            <div className={`absolute inset-0 blur-xl ${company.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`} />
                        </div>
                    ))}
                </div>

                {/* Software Icons Grid */}
                <div className="mt-20 grid grid-cols-4 md:grid-cols-8 gap-4 max-w-4xl mx-auto">
                    {[
                        { name: "Blender", bg: "from-orange-500 to-blue-500" },
                        { name: "Unity", bg: "from-gray-700 to-gray-900" },
                        { name: "Unreal", bg: "from-blue-600 to-cyan-500" },
                        { name: "Maya", bg: "from-cyan-500 to-blue-600" },
                        { name: "3ds Max", bg: "from-teal-500 to-cyan-600" },
                        { name: "C4D", bg: "from-blue-500 to-indigo-600" },
                        { name: "Houdini", bg: "from-orange-600 to-red-600" },
                        { name: "SketchUp", bg: "from-blue-400 to-blue-600" }
                    ].map((software, index) => (
                        <div
                            key={index}
                            className="group relative aspect-square rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300 overflow-hidden"
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${software.bg} opacity-20 group-hover:opacity-40 transition-opacity`} />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-xs font-bold text-white/60 group-hover:text-white/90 transition-colors">
                                    {software.name.slice(0, 1)}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
