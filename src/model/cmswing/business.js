module.exports = class extends think.Model {

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

  async applyFirstQuery(page){
    const list = await this.model('business').where('status = 0 OR status = 1').page(page).countSelect()
    return list;
  }

  async applySecondQuery(page){
    const list = await this.model('business').where({status: 10}).page(page).countSelect();
    return list;
  }

};
