module.exports = {
    apps: [
        {
            name: "web",
            script: "pnpm",
            args: "start --filter web",
            env: {
                PORT: 3004,
                NODE_ENV: "production"
            }
        },
        {
            name: "backend",
            cwd: "./backend",
            script: "bun",
            args: "run dist/index.js",
            env: {
                PORT: 3001,
                NODE_ENV: "production"
            }
        }
    ]
}
