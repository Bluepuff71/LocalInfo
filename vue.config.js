module.exports = {
    publicPath: process.env.NODE_ENV === 'production' ? '/LocalInfo/' : '/',
    configureWebpack: {
        optimization: {
            splitChunks: {
                chunks: 'all'
            }
        }
    }
}