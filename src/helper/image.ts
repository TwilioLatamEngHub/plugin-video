const loadImage = (url: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        const image: HTMLImageElement = new Image();
        image.onload = () => {
            resolve(image)
        }

        image.onerror = reject

        image.src = url
        image.crossOrigin = 'Anonymous'
    })
}

export {
    loadImage
}