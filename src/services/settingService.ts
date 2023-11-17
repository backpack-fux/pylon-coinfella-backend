import { Setting } from "../models/Setting"

export class SettingService {
  static getInstance() {
    return new SettingService()
  }

  async getSetting(name: string) {
    const setting = await Setting.findOne({
      where: {
        name
      }
    })

    return setting?.enabled || false
  }
}