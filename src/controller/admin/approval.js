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
    this.db = this.model('approval');
    this.tactive = 'approval';
  }

  /**
   * index action
   * @return {Promise} []
   */
  async indexAction() {
    // auto render template file approval_index.html
    const map = {};
    if (!think.isEmpty(this.get('model'))) {
      map.model = this.get('model');
    }
    // where({model: ['NOTIN', [1, 4, 9]]}).
    const list = await this.db.where(map).page(this.get('page') || 1, 20).where('model != 4 AND model != 9').order('time DESC').countSelect();
    const html = this.pagination(list);

    this.assign('pagerData', html); // 分页展示使用
    this.assign('list', list);
    // const modlist = await this.model('cmswing/model').get_model(null, null, {
    //   is_approval: 1,
    //   // id:['NOTIN', [1, 4, 9]]
    // });
    const modlist = await this.model('cmswing/model').where({is_approval: 1, id:['NOTIN', [1, 4, 9]]}).select();

    for (const val of modlist) {
      val.count = await this.db.where({
        model: val.id
      }).count();
    }
    this.assign('model', modlist);
    this.assign('count', await this.db.where({model:['NOTIN', [1, 4, 9]]}).count());
    this.meta_title = '内容审核';
    return this.display();
  }

  /**
   * 卖家审核
   */
  async shopAction() {
    // auto render template file approval_shop.html
    const map = {};
    if (!think.isEmpty(this.get('model'))) {
      map.model = this.get('model');
    }
    const listgoods = await this.db.where(map).page(this.get('page') || 1, 20).where('model = 4').order('time DESC').countSelect();
    // const list = await this.model('cmswing/approval').page(this.get('page') || 1, 20).where('model = 4 OR model = 9').order('time DESC').countSelect();
    const htmlgoods = this.pagination(listgoods);
    this.assign('pagerDataGoods', htmlgoods); // 分页展示使用
    this.assign('listgoods', listgoods);
    
    const listshops = await this.db.where(map).page(this.get('page') || 1, 20).where('model = 9').order('time DESC').countSelect();
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

    // console.log(modlist);
    const btn = this.para('model');

    this.assign('getModel', map.model);
    this.assign('model', modlist);
    this.assign('btn', btn);
    this.assign('count', await this.db.where('model = 4 OR model = 9').count());
    this.meta_title = '卖家审核';
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
   * 通过审核
   */
  async adoptaAction() {
    const ids = this.para('ids');
    if (think.isEmpty(ids)) {
      return this.fail('参数错误！');
    }

    const datalist = await this.db.where({
      id: ['IN', ids]
    }).select();
    // console.log(datalist);
    for (const v of datalist) {
      const table = await this.model('cmswing/model').get_table_name(v.model, true);
      console.log(table);
      let res = null;
      switch (table.extend) {
        case 0:
          // console.log(table);
          res = await this.modModel(table.table, table.table).updates(JSON.parse(v.data), v.time);
          if (res) {
            // 添加操作日志，可根据需求后台设置日志类型。
            await this.model('cmswing/action').log('addquestion', 'question', res.id, res.data.uid, this.ip, this.ctx.url);
            // 审核成功后删掉审核表中内容
            await this.db.where({
              id: v.id
            }).delete();
            return this.success({
              name: '审核成功'
            });
          } else {
            return this.fail('操作失败！');
          }
          case 1:
            // todo
            res = await this.model('cmswing/document').updates(JSON.parse(v.data), v.time);
            if (res) {
              // 添加操作日志，可根据需求后台设置日志类型。
              // await this.model("cmswing/action").log("addquestion", "question", res.id, res.data.uid, this.ip, this.ctx.url);
              // 审核成功后删掉审核表中内容
              await this.db.where({
                id: v.id
              }).delete();
              return this.success({
                name: '审核成功'
              });
            } else {
              return this.fail('操作失败！');
            }
      }
    }
  }

  /**
   * 编辑商家审核
   */
  async edshopAction() {
    const ids = this.get('ids');
    this.assign('ids', ids);
    this.meta_title = '审核详情';
    return this.display();
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
    // return this.display();
  // }

  // // /**
  // //  * 新增投稿
  // //  */
  // // async addAction() {
  //   const cate_id = this.get('cate_id') || 0;
  //   // // 权限控制
  //   // const priv = await this.priv(cate_id);
  //   // if (priv) {
  //   //   const error = this.controller('cmswing/error');
  //   //   return error.noAction('您所在的会员组,禁止在本栏目投稿！');
  //   // }
  //   const model_id = this.get('model_id') || 0;
  //   const group_id = this.get('group_id') || '';
  //   // let sortid = this.get('sortid') || 0;
  //   // think.isEmpty(cate_id) && this.fail('参数不能为空');
  //   // think.isEmpty(model_id) && this.fail('该分类未绑定模型');
  //   // // 获取分组定义
  //   let groups = await this.model('cmswing/category').get_category(cate_id, 'groups');
  //   if (groups) {
  //     groups = parse_config_attr(groups);
  //   }
  //   // // 获取分类信息
  //   // let sort = await this.model('cmswing/category').get_category(cate_id, 'documentsorts');
  //   // if (sort) {
  //   //   sort = JSON.parse(sort);
  //   //   if (sortid == 0) {
  //   //     sortid = sort.defaultshow;
  //   //   }
  //   //   const typevar = await this.model('typevar').where({sortid: sortid}).select();
  //   //   for (const val of typevar) {
  //   //     val.option = await this.model('typeoption').where({optionid: val.optionid}).find();
  //   //     if (val.option.type == 'select') {
  //   //       if (!think.isEmpty(val.option.rules)) {
  //   //         val.option.rules = JSON.parse(val.option.rules);
  //   //         val.rules = parse_type_attr(val.option.rules.choices);
  //   //         val.option.rules.choices = parse_config_attr(val.option.rules.choices);
  //   //       }
  //   //     } else if (val.option.type == 'radio' || val.option.type == 'checkbox') {
  //   //       if (!think.isEmpty(val.option.rules)) {
  //   //         val.option.rules = JSON.parse(val.option.rules);
  //   //         val.option.rules.choices = parse_config_attr(val.option.rules.choices);
  //   //       }
  //   //     } else {
  //   //       if (!think.isEmpty(val.option.rules)) {
  //   //         val.option.rules = JSON.parse(val.option.rules);
  //   //       }
  //   //     }
  //   //   }
  //   //   // console.log(typevar);
  //   //   this.assign('typevar', typevar);
  //   // }
  //   // // console.log(sort);
  //   // this.assign('sort', sort);
  //   // // 检查该分类是否允许发布
  //   // const allow_publish = await this.model('cmswing/category').check_category(cate_id);
  //   // // console.log(allow_publish);
  //   // if (!allow_publish) {
  //   //   const error = this.controller('cmswing/error');
  //   //   return error.noAction('本栏目不允许发布内容！');
  //   // }
  //   // // 获取当先的模型信息
  //   const model = await this.model('cmswing/model').get_document_model(model_id);

  //   // 处理结果
  //   const info = {};
  //   info.pid = this.get('pid') ? this.get('pid') : 0;
  //   info.model_id = model_id;
  //   info.category_id = cate_id;
  //   info.group_id = group_id;

  //   if (info.pid) {
  //     const article = await this.model('document').field('id,title,type').find(info.pid);
  //     this.assign('article', article);
  //   }
  //   // // 获取表单字段排序
  //   // const fields = await this.model('cmswing/attribute').get_model_attribute(model.id, true);
  //   // // think.log(fields);
  //   // // 获取当前分类文档的类型
  //   // const type_list = await this.model('cmswing/category').get_type_bycate(cate_id);
  //   // // console.log(type_list);
  //   // // 获取面包屑信息
  //   // const nav = await this.model('cmswing/category').get_parent_category(cate_id);
  //   // console.log(model);
  //   this.assign('groups', groups);
  //   // this.assign('breadcrumb', nav);
  //   // this.assign('info', info);
  //   // this.assign('fields', fields);
  //   // this.assign('type_list', type_list);
  //   this.assign('model', JSON.stringify(model));
  //   // this.meta_title = '新增' + model.title;
  //   // this.active = 'admin/article/index';
  //   // for (const key in parse_config_attr(model.field_group)) {
  //   //   for (const f of fields[key]) {
  //   //     if (f.type === 'editor') {
  //   //       // 添加编辑器钩子
  //   //       if (model.editor === '0') {
  //   //         await this.hook('homeEdit', f.name, f.value, {$hook_key: f.name});
  //   //       } else {
  //   //         await this.hook('homeEdit', f.name, f.value, {$hook_key: f.name, $hook_type: model.editor});
  //   //       }
  //   //     } else if (f.type === 'picture') {
  //   //       await this.hook('homeUpPic', f.name, 0, {$hook_key: f.name});
  //   //     } else if (f.type === 'pics') {
  //   //       await this.hook('homeUpPics', f.name, '', {$hook_key: f.name});
  //   //     } else if (f.type === 'file') {
  //   //       await this.hook('homeUpFile', f.name, 0, {$hook_key: f.name});
  //   //     } else if (f.type === 'atlas') {
  //   //       await this.hook('homeAtlas', f.name, '', {$hook_key: f.name});
  //   //     };
  //   //   };
  //   // };

  //   const ids = this.get('ids');
  //   const details = await this.db.find(ids);
    const detailsInfostr = JSON.parse(details.data);
  //   this.assign('ids', ids);
    this.assign('detailsInfostr', JSON.stringify(detailsInfostr));
  //   this.meta_title = '审核详情';
    // console.log(detailsInfo)
    return this.display();
  }

  /**
   * 拒绝审核
   */
  async refuseAction() {
    // 获取控制台最新请求地址参数
    const ids = this.para('ids');
    if (think.isEmpty(ids)) {
      return this.fail('参数错误！');
    }
    const res = await this.db.where({id: ['IN', ids]}).delete();
    if (res) {
      return this.success({name: '操作成功！'});
    } else {
      return this.fail('操作失败！');
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