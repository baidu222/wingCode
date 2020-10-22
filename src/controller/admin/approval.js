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
    // auto render template file index_index.html
    const map = {};
    if (!think.isEmpty(this.get('model'))) {
      map.model = this.get('model');
    }
    // 原数据
    const list = await this.db.where(map).page(this.get('page') || 1, 20).order('time DESC').countSelect();
    const html = this.pagination(list);

    // 模拟数据

    this.assign('pagerData', html); // 分页展示使用
    this.assign('list', list);
    // this.fail(list);
    const modlist = await this.model('cmswing/model').get_model(null, null, {
      is_approval: 1
    });
    for (const val of modlist) {
      val.count = await this.db.where({
        model: val.id
      }).count();
    }
    // console.log(modlist);
    this.assign('model', modlist);
    this.assign('count', await this.db.count());
    this.meta_title = '一级审核';
    return this.display();
  }

  /**
   * 二次审批
   */
  async secondAction() {
    // auto render template file approval_second.html
    const map = {};
    if (!think.isEmpty(this.get('model'))) {
      map.model = this.get('model');
    }
    const list = await this.db.where(map).page(this.get('page') || 1, 20).order('time DESC').countSelect();
    const html = this.pagination(list);
    this.assign('pagerData', html); // 分页展示使用
    this.assign('list', list);
    const modlist = await this.model('cmswing/model').get_model(null, null, {
      is_approval: 1
    });
    for (const val of modlist) {
      val.count = await this.db.where({
        model: val.id
      }).count();
    }
    // console.log(modlist);
    this.assign('getModel', map.model);
    this.assign('model', modlist);
    this.assign('count', await this.db.count());
    this.meta_title = '二级审核';
    // if(1){
    // this.fail(modlist)
    // }
    return this.display();
  }
  /**
   * 查看详情
   */
  async detailsAction() {
    const id = this.get('id');
    const details = await this.db.find(id);
    const info = JSON.parse(details.data);

    const showdata = [];
    let index = 0;
    const labelList = ['公司全名', '公司介绍', '经营方式', '经营范围', '法人', '电话', '邮箱', '功能公司地址', 'logo', '企业营业执照', '银行开户许可证', '医疗器械生产许可证', '生产备案凭证', '网络销售许可证', '法人身份复印件', '销售授权委托书'];
    for (const key in info) {
      showdata[index] = {
        label: labelList[index],
        key: key,
        value: info[key]
      }
      index ++ ;
    }

    // if (1) {
    //   return console.log(showdata.length);
    // }
    // console.log(info);
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
    // else{
    //   this.fail(ids)
    // }

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
   * 拒绝审核页面
   */
  async refdialogAction() {
    const ids = this.get('ids');
    this.assign('ids', ids);
    this.meta_title = '拒绝审核';
    return this.display();
  }

  /**
   * 拒绝审核
   */
  async refuseAction() {
    // 获取当前参数
    const ids = this.para('ids');

    if (think.isEmpty(ids)) {
      return this.fail('参数错误！', ids);
    } else {
      // return this.fail(ids);
      return this.success({name: '操作成功！'});
    }
    debugger;
    // console.log(ids);
    const res = await this.db.where({
      id: ['IN', ids]
    }).delete();
    if (res) {
      return this.success({
        name: '操作成功！'
      });
    } else {
      return this.fail('操作失败！');
    }
    return this.display();
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