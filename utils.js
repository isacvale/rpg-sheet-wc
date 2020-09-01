const runMethod = async (target, method, argList, count = 0) => {
    if (count > 100) return
    if (target[method]) {
        target[method](...argList)
        return true
    }
    window.requestAnimationFrame(() => runMethod(target, method, argList, count + 1))
}

const onConnected = (target, callback, argList) => {
    target.addEventListener('connected', () => callback(...argList))
}

export {
    onConnected,
    runMethod
}