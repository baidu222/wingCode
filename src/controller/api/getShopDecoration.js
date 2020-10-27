module.exports = class extends think.cmswing.rest {
  /**
   * 获取店铺信息
   */
  async getAction() {
    let id = this.get('shopId')
    let status = this.get('status')
    let params = {
      shop_id: id
    }
    if (status > 0) {
      params.status = status
    }
    const data = await this.model('shop').find(id);
    let decorationData = await this.model('shop_decoration').find({where: params});
    decorationData = Object.keys(decorationData).length ? decorationData : {
      decoration: '[]'
    }
    let result = {
      shopId: id,
      shopName: data.shop_name,
      ...decorationData
    }
    return this.success(result);
  }
};
