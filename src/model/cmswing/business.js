module.exports = class extends think.Model {

  async applyAdd(data) {
    await this.model('business').add(data);
  }

  async applyQuery(biz_id) {
    const applydata = await this.model('business').where({id: biz_id}).find();
    return applydata;
  }

  async applyQueryByUser(user_id) {
    const applydata = await this.model('business').where({user_id: user_id}).find();
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

  async applyConditionQuery(condition){
    const list = await this.model('business').where(condition).select();
    return list;
  }


  async expireCheck(){
    const applydatas = await this.model('business').where({status: 20}).select();
    for (const itme of applydatas) {
      const warningtime = think.ms('90 days');
      const checktime = new Date(new Date().toLocaleDateString()).getTime();
      //商户注册到期，该商户商品全部下架
      if (checktime >= itme.expire_date){

      }
      //距离商户注册90天，进行报警提醒
      if (checktime >= (itme.expire_date + warningtime)){

      }
    }
    return applydatas;
  }

};
