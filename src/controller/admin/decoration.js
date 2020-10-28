// +----------------------------------------------------------------------
// | CmsWing [ 网站内容管理框架 ]
// +----------------------------------------------------------------------
// | Copyright (c) 2015-2115 http://www.cmswing.com All rights reserved.
// +----------------------------------------------------------------------
// | Author: arterli <arterli@qq.com>
// +----------------------------------------------------------------------

module.exports = class extends think.cmswing.admin {
  constructor(ctx) {
    super(ctx); // 调用父级的 constructor 方法，并把 ctx 传递进去
    // 其他额外的操作
    this.tactive = 'decoration';
  }
 /**
   * 获取店铺信息
   */
  async getListAction() {
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

  /**
   * 保存装修数据
   */
  async saveAction() {
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

  /**
   * 获取商品列表
   */
  async goodsListAction() {
    let kw = this.get('kw')
    let page = this.get('page')
    let pagesize = this.get('pageSize')
    const map = {};
    if (!think.isEmpty(kw)) {
      map.name = ['like', '%' + kw + '%'];
    }
    map.user_id = 4;
    map.status = 2
    const goods = await this.model('goods').page(page, pagesize).where(map).countSelect();
    if (goods.count) {
      const narr = [];
      for (const v of goods.data) {
        let pictureList = [];
        if (v.picture) {
          pictureList.push(v.picture)
        }
        if (v.picture1) {
          pictureList.push(v.picture1)
        }
        if (v.picture2) {
          pictureList.push(v.picture2)
        }
        v.pictureList = pictureList
      }
    }
    return this.success(goods);
  }
}