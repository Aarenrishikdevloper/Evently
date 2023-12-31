const {hostname} = require("node:os");
/** @type {import('next').NextConfig} */
const nextConfig = {
    images:{
        domains:["utfs.io"]

    }
}

module.exports = nextConfig
