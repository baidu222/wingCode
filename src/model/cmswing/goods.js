module.exports = class extends think.Model {

  async goodsAdd(data) {
    return await this.model('goods').add(data);
  }

  async goodsQuery(goods_id) {
    const goodsdata = await this.model('goods').where({id: goods_id}).find();
    return goodsdata;
  }

  async goodsUpdate(condition,updatedata){
    const goodsdata = await this.model('goods').where(condition).update(updatedata);
    return goodsdata;
  }

   async goodsFirstQuery(page){
    const list = await this.model('goods').where('status = 0 OR status = 1').page(page).countSelect()
    return list;
  }

   async goodsSecondQuery(page){
    const list = await this.model('goods').where({status: 10}).page(page).countSelect();
    return list;
  }

  async goodConditionQuery(condition){
      const list = await this.model('goods').where(condition).select();
      return list;
  }

};
