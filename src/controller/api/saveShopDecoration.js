module.exports = class extends think.cmswing.rest {
  /**
   * 保存装修数据
   */
  async postAction() {
    let id = this.post('id')
    // 判断是否存在这里数据
    const result = await this.model('shop_decoration').find({
      where: {
        shop_id: id
      }
    });
    let isExits = Object.keys(result).length
    let data = this.post('data')
    let status = this.post('status')
    let params = {
      status: status, 
      decoration: data,
      update_time: new Date().getTime()
    }
    // 更新
    if (isExits) {
      await this.model('shop_decoration').where({
        shop_id: id
      }).update(params);
    }
    else {
      params.shop_id = id;
      params.create_time = new Date().getTime()
      console.log('111', params)
      await this.model('shop_decoration').add(params);
    }
    return this.success();
  }
};
