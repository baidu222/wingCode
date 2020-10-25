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
    // 全部一级审核数量（改）
    this.assign('count', await this.db.where({
      model: ['IN', [4, 9]]
    }).count());

    // 获取数据
    const map = {};
    if (!think.isEmpty(btn)) {
      map.model = btn;
    }
    // where({model: ['NOTIN', [1, 4, 9]]}).
    // const list = await this.db.where(map).page(this.get('page') || 1, 10).where('model = 4 OR model = 9').order('time DESC').countSelect();
    // 获取卖家一级审核
    let listshop = await this.model('cmswing/business').where('status = 0 OR status = 10').page(page).countSelect();
    const htmlShop = await this.pagination(listshop);
    this.assign('pagerDataShop', htmlShop); // 分页展示使用
    this.assign('listshop', listshop);

    // 获取商品一级审核
    const listgoods = await this.model('cmswing/business').where('status = 0 OR status = 10').page(page).countSelect();
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
    const map = {};
    if (!think.isEmpty(this.get('model'))) {
      map.model = this.get('model');
    }
    const listgoods = await this.db.where(map).page(this.get('page') || 1, 10).where('model = 4').order('time DESC').countSelect();
    // const list = await this.model('cmswing/approval').page(this.get('page') || 1, 10).where('model = 4 OR model = 9').order('time DESC').countSelect();
    const htmlgoods = this.pagination(listgoods);
    this.assign('pagerDataGoods', htmlgoods); // 分页展示使用
    this.assign('listgoods', listgoods);


    // const listshops = await this.db.where(map).page(this.get('page') || 1, 10).where('model = 9').order('time DESC').countSelect();
    // const listshops = await this.model('cmswing/business').where(map).page(this.get('page') || 1, 10).where('model = 9').order('time DESC').countSelect();
    // const listshops = await this.model('cmswing/business').page(this.get('page') || 1, 10).order('id DESC').countSelect();
    let listshops = await this.model('cmswing/business').where('status = 1 OR status = 11 OR status = 20 OR status = 21').page(this.get('page') || 1, 10).countSelect();


    const htmlshops = this.pagination(listshops);
    this.assign('pagerDataShops', htmlshops); // 分页展示使用
    this.assign('listshops', listshops);

    // 菜单显示
    const modlist = await this.model('cmswing/model').where('id = 4 OR id = 9').order('id DESC').select();

    for (const val of modlist) {
      val.count = await this.db.where({
        model: val.id
      }).count();
    }

    const btn = this.para('model');

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
    // this.assign('userinfo',this.user.uid);
    if(this.isPost){
        const data = this.post();
        const biz_id = data.biz_id;
        // const user_id = data.user_id;

        if (!think.isNullOrUndefined(data.action_type)){
            const action_type = data.action_type;

            if (action_type == "first_pass"){
                const  condition = {
                    "id":biz_id
                };
                const  updatedata = {
                    "status":10,
                    "first_pass_user":user_id
                };
                const res = await this.model('cmswing/business').where(condition).update(updatedata);
                if (res) {
                  return this.success({name: '更新成功!'});
                  // return this.display();

                } else {
                  return this.fail('更新失败!');
                }
            }else if(action_type == "second_pass"){
                const  condition = {
                    "id":biz_id
                };
                const  updatedata = {
                    "status":20,
                    "second_pass_user":user_id
                };
                const res = await this.model('cmswing/business').where(condition).update(updatedata);
                if (res) {
                  return this.success({name: '更新成功!'});
                  // return this.display();

                } else {
                  return this.fail('更新失败!');
                }
            }else if(action_type == "first_reject"){
                if (!think.isNullOrUndefined(data.reject)){
                    var reject = data.reject;
                }else{
                    var reject = "";
                }
                const  condition = {
                    "id":biz_id
                };
                const  updatedata = {
                    "status":11,
                    "first_reject":reject
                };
                const res = await this.model('cmswing/business').where(condition).update(updatedata);
                if (res) {
                  return this.success({name: '更新成功!'});
                  // return this.display();

                } else {
                  return this.fail('更新失败!');
                }
                // await this.model('cmswing/business').where(condition).update(updatedata);
                // return applydata;
                // await this.model('cmswing/business').applyUpdate(condition,updatedata);
                // return this.success({code:200,reject:reject});
            }else if(action_type == "second_reject"){
                if (!think.isNullOrUndefined(data.reject)){
                    var reject = data.reject;
                }else{
                    var reject = "";
                }
                const  condition = {
                    "id":biz_id
                };
                const  updatedata = {
                    "status":21,
                    "second_reject":reject
                };
                const res = await this.model('cmswing/business').where(condition).update(updatedata);
                if (res) {
                  return this.success({name: '更新成功!'});
                  // return this.display();

                } else {
                  return this.fail('更新失败!');
                }
            }else{
                return this.fail({code:500,msg:"error param"});
            }
        }
    }else{

    const ids = this.get('ids');
    this.assign('ids', ids);
    this.meta_title = '审核详情';
    const details = await this.model('cmswing/business').where({
      id: ids
    }).select();
    // this.assign('detailsxx', JSON.stringify(details));
    this.assign('details', details[0]);
    this.assign('biz_id',details[0].id);
    this.assign('user_id',details[0].user_id);
    return this.display();
    }
   
  }

  /**
   * 编辑商品审核
   */
  async edgoodsAction() {
    const ids = this.get('ids');
    const details = await this.db.find(ids);
    const detailsInfo = JSON.parse(details.data);
    this.assign('ids', ids);
    this.assign('detailsInfo', detailsInfo);
    this.meta_title = '审核详情';

    let model_id = 0;
    if (this.get('model') == 4) {
      model_id = 4
    } else {
      model_id = 0
    }

    // 获取当先的模型信息
    const model = await this.model('cmswing/model').get_document_model(model_id);

    // this.assign('model', JSON.stringify(model.field_group));

    this.assign('model', model);


    //   const ids = this.get('ids');
    //   const details = await this.db.find(ids);
    // const detailsInfostr = JSON.parse(details.data);
    //   this.assign('ids', ids);
    // this.assign('detailsInfostr', JSON.stringify(detailsInfostr));
    //   this.meta_title = '审核详情';
    // console.log(detailsInfo)
    return this.display();
  }

  /**
   * 拒绝审核
   */
  async refuseAction() {
    // 获取控制台最新请求地址参数
    // const ids = this.para('ids');
    // if (think.isEmpty(ids)) {
    //   return this.fail('参数错误！');
    // }
    // const res = await this.db.where({
    //   id: ['IN', ids]
    // }).delete();
    // if (res) {
    //   return this.success({
    //     name: '操作成功！'
    //   });
    // } else {
    //   return this.fail('操作失败！');
    // }

    const data = this.post();
    const biz_id = data.biz_id;
    const user_id = data.user_id;
    if (!think.isNullOrUndefined(data.action_type)) {
      const action_type = data.action_type;
      if (action_type == "first_pass") {
        const condition = {
          "id": biz_id
        };
        const updatedata = {
          "status": 10,
          "first_pass_user": user_id
        };
        await this.model('cmswing/business').applyUpdate(condition, updatedata);
        return this.success({
          code: 200
        });
      } else if (action_type == "second_pass") {
        const condition = {
          "id": biz_id
        };
        const updatedata = {
          "status": 20,
          "second_pass_user": user_id
        };
        await this.model('cmswing/business').applyUpdate(condition, updatedata);
        return this.success({
          code: 200
        });
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
          "status": 11,
          "first_reject": reject
        };
        await this.model('cmswing/business').applyUpdate(condition, updatedata);
        return this.success({
          code: 200,
          reject: reject
        });
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
          "status": 21,
          "second_reject": reject
        };
        await this.model('cmswing/business').applyUpdate(condition, updatedata);
        return this.success({
          code: 200,
          reject: reject
        });
      } else {
        return this.fail({
          code: 500,
          msg: "error param"
        });
      }
    }

  }

  /**
   * 按时间排序
   */
  async timeAction() {
    // const ids = this.para('ids');
    // if (think.isEmpty(ids)) {
    //   return this.fail('参数错误！');
    // }
    // const res = await this.db.where({id: ['IN', ids]}).delete();
    // if (res) {
    // return 
    this.success({
      name: '操作成功！'
    });
    // } else {
    //   return this.fail('操作失败！');
    // }
  }


  /**
   * 按类型排序
   */
  async typeAction() {
    // const ids = this.para('ids');
    // if (think.isEmpty(ids)) {
    //   return this.fail('参数错误！');
    // }
    // const res = await this.db.where({id: ['IN', ids]}).delete();
    // if (res) {
    // return 
    this.success({
      name: '操作成功！'
    });
    // } else {
    //   return this.fail('操作失败！');
    // }
  }

};