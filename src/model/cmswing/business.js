/* eslint-disable indent */
// +----------------------------------------------------------------------
// | CmsWing [ 网站内容管理框架 ]
// +----------------------------------------------------------------------
// | Copyright (c) 2015-2115 http://www.cmswing.com All rights reserved.
// +----------------------------------------------------------------------
// | Author: arterli <arterli@qq.com>
// +----------------------------------------------------------------------
module.exports = class extends think.Model {
  /**
     * 获取行为数据
     * @param string id 行为id
     * @param string field 需要获取的字段
     * @author arterli <arterli@qq.com>
     */
  async applyAdd(data) {
    await this.model('business').add(data);
  }

  async applyQuery(biz_id) {
    const applydata = await this.model('business').where({id: biz_id}).find();
    return applydata;
  }

  async applyQueryByUser(user_id) {
    const applydata = await this.model('business').where({user_id: user_id}).select();
    return applydata;
  }

  async applyUpdate(condition,updatedata){
    const applydata = await this.model('business').where(condition).update(updatedata);
    return applydata;
  }

  async applyFirstQuery(){
    const applydata = await this.model('business').where('status = 0 OR status = 1').select();
    return applydata;
  }

  async applySecondQuery(){
    const applydata = await this.model('business').where({status: 10}).select();
    return applydata;
  }

};
