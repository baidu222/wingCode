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
    this.tactive = 'shop';
  }
  /**
   * index action
   * @return {Promise} []
   */
  indexAction() {
    // auto render template file index_index.html

    return this.display();
  }
  // 店铺装修
  async decorationAction() {
    const status = this.get('status');
    const map = {};
    if (!think.isEmpty(status)) {
      map.status = status;
      this.assign('status', status);
    }
    const q = this.get('q');
    if (!think.isEmpty(q)) {
      map['order_no|user_id|accept_name|mobile'] = ['like', q];
    }
    map.is_del = 0;
    const data = await this.model('shop').where(map).page(this.get('page') || 1, 20).order('create_time DESC').countSelect();
    const html = this.pagination(data);
    this.assign('pagerData', html); // 分页展示使用
    this.active = 'admin/shop/decoration';
    this.assign('list', data.data);
    this.meta_title = '订单管理';
    return this.display();
  }

  // 保证金
  async marginAction() {
    const status = this.get('status');
    const map = {};
    if (!think.isEmpty(status)) {
      map.status = status;
      this.assign('status', status);
    }
    const q = this.get('q');
    if (!think.isEmpty(q)) {
      map['order_no|user_id|accept_name|mobile'] = ['like', q];
    }
    map.is_del = 0;
    const data = await this.model('shop').where(map).page(this.get('page') || 1, 20).order('create_time DESC').countSelect();
    const html = this.pagination(data);
    this.assign('pagerData', html); // 分页展示使用
    this.active = 'admin/shop/margin';
    this.assign('list', data.data);
    this.meta_title = '保证金';
    this.meta_title_sub = '保证金管理'
    return this.display();
  }
  // 立即缴纳
  async moneyAction() {
    this.active = 'admin/shop/money';
    this.meta_title = '保证金缴纳';
    return this.display();
  }

  // 立即缴纳
  async wxpayAction() {
    this.active = 'admin/shop/wxpay';
    this.meta_title = '微信支付';
    return this.display();
  }

  // 立即缴纳
  async successAction() {
    this.active = 'admin/shop/success';
    this.meta_title = '支付成功';
    return this.display();
  }
  // 申请解冻
  async thawAction() {
    this.active = 'admin/shop/thaw';
    this.meta_title = '申请解冻';
    return this.display();
  }
  // 立即缴纳
  async thawsuccessAction() {
    this.active = 'admin/shop/thawsuccess';
    this.meta_title = '申请解冻';
    return this.display();
  }

  /**
   * 新增店铺装修
   */
  async adddecorationAction() {
    if (this.isPost) {
      let data = this.post();
      // 新建的操作
      data.create_time = new Date().getTime();
      data.update_time = new Date().getTime();
      const res = await this.model('shop').add(data);
      if (res) {
        return this.success({name: '添加成功!'});
      } else {
        return this.fail('添加失败!');
      }
    } else {
      this.meta_title = '添加页面';
      return this.display();
    }
  }
  /**
   * 编辑页面
   * @returns {Promise.<void>}
   */
  async editdecorationAction() {
    if (this.isPost) {
      const data = this.post();
      const res = await this.model('shop').update(data);
      if (res) {
        return this.success({name: '更新成功!'});
      } 
      return this.fail('更新失败!');
    } else {
      const id = this.get('id');
      const info = await this.model('shop').find(id);
      console.log('122', info)
      this.assign('info', info);
      this.meta_title = '编辑页面';
      return this.display();
    }
  }
  /**
   * 删除店铺
   */
  async deledecorationAction() {
    const id = this.get('id');
    console.log('111', id)
    // 作废的订单才能删除
    const res = await this.model('shop').where({id: id}).update({
      is_del: 1,
      update_time: new Date().getTime()
    });
    if (res) {
      return this.success({name: '删除成功！'});
    } else {
      return this.fail('删除失败！');
    }
  }
  /**
   * 复制
   */
  /**
   * 复制文档
   * @returns {Promise.<*>}
   */
  async copyAction() {
    let data = this.post('shop_url');
    await this.session('copyArticle', data);
    await this.session('moveArticle', null);
    return this.success({name: '复制成功'});
  }
}