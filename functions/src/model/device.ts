
export type DeviceData = {
    apiKey: string
}

class Device {
    constructor(public id: string, public data: DeviceData) { }
}

export {
    Device
}