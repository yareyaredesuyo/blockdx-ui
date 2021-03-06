const fs = require('fs-extra-promise');
const cloneDeep = require('lodash/cloneDeep');
const omit = require('lodash/omit');

class SimpleStorage {

  constructor(dataFilePath) {
    this._dataFilePath = dataFilePath;
    fs.ensureFileSync(dataFilePath);
    let data;
    try {
      data = fs.readJsonSync(dataFilePath);
    } catch(err) {
      data = {};
      fs.writeJsonSync(dataFilePath, data);
    }
    this._data = data;
  }

  async saveData() {
    try {
      await fs.writeJsonAsync(this._dataFilePath, this._data);
    } catch(err) {
      console.error(err);
    }
  }

  saveDataSync() {
    fs.writeJsonSync(this._dataFilePath, this._data);
  }

  getItem(key) {
    const item = this._data[key];
    if(!item) return item;
    return cloneDeep(item);
  }

  setItem(key, val, saveSync) {
    if(!val) {
      this._data[key] = val;
    } else {
      this._data[key] = cloneDeep(val);
    }
    if(saveSync) {
      this.saveDataSync();
    } else {
      this.saveData();
    }
    return val;
  }

  removeItem(key) {
    const newData = omit(this._data, [key]);
    this._data = newData;
    this.saveData();
    return;
  }

  clear() {
    this._data = {};
    this.saveData();
    return;
  }

}

module.exports = SimpleStorage;
