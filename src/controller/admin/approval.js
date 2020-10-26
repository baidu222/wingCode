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
    this.db = this.model('cmswing/approval');
    this.tactive = 'approval';
  }

  /**
   * index action 一级审核
   * @return {Promise} []
   */
  async indexAction() {
    // auto render template file approval_index.html
    let page = this.get('page');
    const btn = this.get('model');
    this.assign('btn', btn)
    // tab切换栏
    const modlist = await this.model('cmswing/model').where('id = 4 OR id = 9').order('id DESC').select();
    for (const val of modlist) {
      // 查两张表 （改）
      val.count = await this.db.where({
        model: val.id
      }).count();
    }
    this.assign('model', modlist);
    // 全部一级审核数量
    let countshop = await this.model('cmswing/business').where('biz_status = 0 OR biz_status = 1').count()
    let countgoods = await this.model('cmswing/goods').where('goods_status = 0 OR goods_status = 1').count();
    this.assign('count', countshop + countgoods);
    this.assign('countshop', countshop);
    this.assign('countgoods', countgoods);

    // 获取数据
    const map = {};
    if (!think.isEmpty(btn)) {
      map.model = btn;
    }
    // where({model: ['NOTIN', [1, 4, 9]]}).
    // const list = await this.db.where(map).page(this.get('page') || 1, 10).where('model = 4 OR model = 9').order('time DESC').countSelect();
    // 获取卖家一级审核
    let listshop = await this.model('cmswing/business').where('biz_status = 0 OR biz_status = 1').page(page || 1, 10).countSelect();
    const htmlShop = await this.pagination(listshop);
    this.assign('pagerDataShop', htmlShop); // 分页展示使用
    this.assign('listshop', listshop);

    // 获取商品一级审核
    const listgoods = await this.model('cmswing/goods').where('goods_status = 0 OR goods_status = 1').page(page).countSelect();
    const htmlgoods = await this.pagination(listgoods);
    this.assign('pagerDataGoods', htmlgoods); // 分页展示使用
    this.assign('listgoods', listgoods);

    const list = [];
    const html = await this.pagination(list);
    this.assign('pagerData', html); // 分页展示使用
    this.assign('list', list);

    this.meta_title = '一级审核';
    return this.display();
  }

  /**
   * 二级审核
   */
  async secondAction() {
    // auto render template file approval_second.html
    let page = this.get('page');
    const btn = this.get('model');
    this.assign('btn', btn)
    // tab切换菜单
    const modlist = await this.model('cmswing/model').where('id = 4 OR id = 9').order('id DESC').select();
    for (const val of modlist) {
      // 查两张表 （改）
      val.count = await this.db.where({
        model: val.id
      }).count();
    }
    this.assign('model', modlist);

    // 全部二级审核数量
    let countshop = await this.model('cmswing/business').where('biz_status = 10').count()
    let countgoods = await this.model('cmswing/goods').where('goods_status = 10').count();
    this.assign('count', countshop + countgoods);
    this.assign('countshop', countshop);
    this.assign('countgoods', countgoods);

    // 获取数据
    const map = {};
    if (!think.isEmpty(btn)) {
      map.model = btn;
    }
    // where({model: ['NOTIN', [1, 4, 9]]}).
    // 获取卖家二级审核
    let listshops = await this.model('cmswing/business').where('biz_status = 10').page(page || 1, 10).countSelect();
    const htmlShop = await this.pagination(listshops);
    this.assign('pagerDataShop', htmlShop); // 分页展示使用
    this.assign('listshop', listshops);

    // 获取商品二级审核
    const listgoods = await this.model('cmswing/goods').where('goods_status = 10').page(page || 1, 10).countSelect();
    const htmlgoods = await this.pagination(listgoods);
    this.assign('pagerDataGoods', htmlgoods); // 分页展示使用
    this.assign('listgoods', listgoods);

    const list = [];
    const html = await this.pagination(list);
    this.assign('pagerData', html); // 分页展示使用
    this.assign('list', list);

    this.assign('getModel', map.model);
    this.assign('model', modlist);
    this.assign('btn', btn);
    this.assign('count', await this.db.where('model = 4 OR model = 9').count());
    this.meta_title = '二级审核';

    return this.display();
  }
  /**
   * 查看详情
   */
  async detailsAction() {
    const id = this.get('id');
    const details = await this.db.find(id);
    const info = JSON.parse(details.data);

    this.assign('info', info);
    this.meta_title = '查看详情';
    return this.display();
  }

  /**
   * 编辑商家审核
   */
  async edshopAction() {
    // 用户信息
    this.user = await this.session('userInfo');
    const user_id = this.user.uid;
    // this.assign('model_id', model_id);
    if (this.isPost) {
      const data = this.post();
      const biz_id = data.biz_id;

      if (!think.isNullOrUndefined(data.action_type)) {
        const action_type = data.action_type;

        if (action_type == "first_pass") {
          const condition = {
            "id": biz_id
          };
          const updatedata = {
            "biz_status": 10,
            "first_pass_user": user_id
          };
          const res = await this.model('cmswing/business').where(condition).update(updatedata);
          if (res) {
            this.redirect('/admin/approval/index/?model=9');
            return this.success({
              name: '更新成功!'
            });
          } else {
            // this.redirect('/admin/approval/index')
            this.redirect('/admin/approval/index/?model=9');
            return this.fail('更新失败!');
          }
        } else if (action_type == "second_pass") {
          const condition = {
            "id": biz_id
          };
          const updatedata = {
            "biz_status": 20,
            "second_pass_user": user_id
          };
          const res = await this.model('cmswing/business').where(condition).update(updatedata);
          if (res) {
            this.redirect('/admin/approval/second/?model=9')
            return this.success({
              name: '更新成功!'
            });
          } else {
            this.redirect('/admin/approval/second/?model=9')
            return this.fail('更新失败!');
          }
        } else if (action_type == "first_reject") {
          if (!think.isNullOrUndefined(data.reject)) {
            var reject = data.reject;
          } else {
            var reject = "";
          }
          const condition = {
            "id": biz_id
          };
          const updatedata = {
            "biz_status": 11,
            "first_reject": reject
          };
          const res = await this.model('cmswing/business').where(condition).update(updatedata);
          if (res) {
            this.redirect('/admin/approval/index/?model=9')
            return this.success({
              name: '更新成功!'
            });
          } else {
            this.redirect('/admin/approval/index/?model=9')
            return this.fail('更新失败!');
          }
        } else if (action_type == "second_reject") {
          if (!think.isNullOrUndefined(data.reject)) {
            var reject = data.reject;
          } else {
            var reject = "";
          }
          const condition = {
            "id": biz_id
          };
          const updatedata = {
            "biz_status": 21,
            "second_reject": reject
          };
          const res = await this.model('cmswing/business').where(condition).update(updatedata);
          if (res) {
            this.redirect('/admin/approval/second/?model=9')
            return this.success({
              name: '更新成功!'
            });
          } else {
            this.redirect('/admin/approval/second/?model=9');
            return this.fail('更新失败!');
          }
        } else {
          return this.fail({
            code: 500,
            msg: "error param"
          });
        }
      }
    } else {

      const ids = this.get('ids');
      this.assign('ids', ids);
      this.meta_title = '审核详情';
      const details = await this.model('cmswing/business').where({
        id: ids
      }).select();
      this.assign('details', details[0]);
      this.assign('biz_id', details[0].id);
      this.assign('user_id', details[0].user_id);
      return this.display();
    }

  }
  /**
   * 编辑商品审核
   */
  async edgoodsAction() {
    // 用户信息
    this.user = await this.session('userInfo');
    const user_id = this.user.uid;
    if (this.isPost) {
      const data = this.post();
      const goods_id = data.goods_id;

      if (!think.isNullOrUndefined(data.action_type)) {
        const action_type = data.action_type;

        if (action_type == "first_pass") {
          const condition = {
            "id": goods_id
          };
          const updatedata = {
            "goods_status": 10,
            "first_pass_user": user_id,
            "update_time": Date.now()
          };
          const res = await this.model('cmswing/goods').where(condition).update(updatedata);
          if (res) {
            this.redirect('/admin/approval/index/?model=4')
            return this.success({
              name: '更新成功!'
            });
          } else {
            this.redirect('/admin/approval/index/?model=4')
            return this.fail('更新失败!');
          }
        } else if (action_type == "second_pass") {
          const condition = {
            "id": goods_id
          };
          const updatedata = {
            "goods_status": 20,
            "second_pass_user": user_id,
            "update_time": Date.now()
          };
          const res = await this.model('cmswing/goods').where(condition).update(updatedata);
          if (res) {
            this.redirect('/admin/approval/second/?model=4')
            return this.success({
              name: '更新成功!'
            });
          } else {
            this.redirect('/admin/approval/second/?model=4')
            return this.fail('更新失败!');
          }
        } else if (action_type == "first_reject") {
          let reject = "";
          if (!think.isNullOrUndefined(data.reject)) {
            reject = data.reject;
          }
          const condition = {
            "id": goods_id
          };
          const updatedata = {
            "goods_status": 11,
            "first_reject": reject,
            "update_time": Date.now()
          };
          const res = await this.model('cmswing/goods').where(condition).update(updatedata);
          if (res) {
            this.redirect('/admin/approval/index/?model=4')
            return this.success({
              name: '更新成功!'
            });
          } else {
            this.redirect('/admin/approval/index/?model=4')
            return this.fail('更新失败!');
          }
        } else if (action_type == "second_reject") {
          let reject = "";
          if (!think.isNullOrUndefined(data.reject)) {
            reject = data.reject;
          }
          const condition = {
            "id": goods_id
          };
          const updatedata = {
            "goods_status": 21,
            "second_reject": reject,
            "update_time": Date.now()
          };
          const res = await this.model('cmswing/goods').where(condition).update(updatedata);
          if (res) {
            this.redirect('/admin/approval/second/?model=4')
            return this.success({
              name: '更新成功!'
            });
          } else {
            this.redirect('/admin/approval/second/?model=4');
            return this.fail('更新失败!');
          }
        } else {
          return this.fail({
            code: 500,
            msg: "error param"
          });
        }
      }
    } else {
      const ids = this.get('ids');
      this.assign('ids', ids);
      this.meta_title = '审核详情';
      const details = await this.model('cmswing/goods').where({
        id: ids
      }).select();
      this.assign('details', details[0]);
      this.assign('biz_id', details[0].id);
      this.assign('user_id', details[0].user_id);
      return this.display();
    }

  }

};