// +----------------------------------------------------------------------
// | CmsWing [ 网站内容管理框架 ]
// +----------------------------------------------------------------------
// | Copyright (c) 2015-2115 http://www.cmswing.com All rights reserved.
// +----------------------------------------------------------------------
// | Author: arterli <arterli@qq.com>
// +----------------------------------------------------------------------

module.exports = class extends think.cmswing.admin {
    /**
       * index action
       * @return {Promise} []
       */
    constructor(ctx) {
      super(ctx); // 调用父级的 constructor 方法，并把 ctx 传递进去
      // 其他额外的操作
      this.tactive = 'business';
    }
    /**
       * 后台节点配置的url作为规则存入auth_rule
       * 执行新节点的插入,已有节点的更新,无效规则的删除三项任务
       * @author
       */
    async updaterules() {
      // 需要新增的节点必然位于$nodes
      const nodes = await this.returnnodes(false);
      // console.log(nodes);
      const AuthRule = this.model('auth_rule');
      const map = {'module': 'admin', 'type': ['in', [1, 2]]};// status全部取出,以进行更新
      // 需要更新和删除的节点必然位于$rules
      const rules = await AuthRule.where(map).order('name').select();
      // 构建insert数据
      const data = {};// 保存需要插入和更新的新节点
  
      nodes.forEach(value => {
        const temp = {};
        temp.name = value.url;
        temp.desc = value.title;
        temp.module = 'admin';
        if (value.pid > 0) {
          temp.type = 1;
        } else {
          temp.type = 2;
        }
        temp.status = 1;
        let url = temp.name + temp.module + temp.type;
        url = url.toLocaleLowerCase();
        data[url] = temp;
      });
      // console.log(rules);
      const update = [];// 保存需要更新的节点
      const ids = [];// 保存需要删除的节点的id
      const diff = {};
      rules.forEach((rule, i) => {
        let key = rule.name + rule.module + rule.type;
        key = key.toLocaleLowerCase();
        if (!think.isEmpty(data[key])) { // 如果数据库中的规则与配置的节点匹配,说明是需要更新的节点
          data[key].id = rule.id;// 为需要更新的节点补充id值
          update.push(data[key]);
          delete data[key];
          // console.log(i);
          // rules.splice(i,1);
          delete rule.condition;
          delete rule.pid;
          // console.log(rule);
          diff[rule.id] = rule;
        } else {
          if (rule.status == 1) {
            ids.push(rule.id);
          }
        }
      });
  
      // console.log(update);
      // console.log(rules);
      // console.log(diff);
      // console.log(data);
      if (!think.isEmpty(update)) {
        update.forEach(row => {
          // console.log(isObjectValueEqual(row, diff[row.id]))
          // console.log(row)
          // console.log(diff[row.id])
          if (!isObjectValueEqual(row, diff[row.id])) {
            AuthRule.where({id: row.id}).update(row);
            // console.log(row);
          }
        });
      }
      // console.log(ids);
      if (!think.isEmpty(ids)) {
        AuthRule.where({id: ['IN', ids]}).update({'status': -1});
        // 删除规则是否需要从每个用户组的访问授权表中移除该规则?
      }
      // console.log(data);
      if (!think.isEmpty(data)) {
        AuthRule.addMany(obj_values(data));
      }
  
      return true;
    }
  
    /**
       * role
       * 权限管理首页ajax角色列表
       * @returns {Promise|*}
       */
      async informationAction() {
        const list = await this.model('member_group').order('sort ASC').select();
        for (const v of list) {
          v.count = await this.model('member').where({groupid: v.groupid, status: 1}).count('id');
        }
        
        this.assign('list', list);
        this.meta_title = '商家认证信息';
        await this.hook('adminUpPic', 'logo', 0, {$hook_key: 'logo'});
        await this.hook('adminUpPic', 'license', 0, {$hook_key: 'license'});
        await this.hook('adminUpPic', 'account', 0, {$hook_key: 'account'});
        await this.hook('adminUpPic', 'prod_cert', 0, {$hook_key: 'prod_cert'});
        await this.hook('adminUpPic', 'registration', 0, {$hook_key: 'registration'});
        await this.hook('adminUpPic', 'online_sales', 0, {$hook_key: 'online_sales'});
        await this.hook('adminUpPic', 'legal_person_front', 0, {$hook_key: 'legal_person_front'});
        await this.hook('adminUpPic', 'legal_person_back', 0, {$hook_key: 'legal_person_back'});

        // await this.hook('adminUpPic', 'logo2', 0, {$hook_key: 'logo2'});
        
      if(this.isPost){
        $.ajax({
            url: '/home/business/applysubmit',
            type: 'POST', 
            contentType: false,
            // 告诉jQuery不要去设置Content-Type请求头
            processData: false,
            data: d, 
            success:res=>{
                console.log(res)
                if(!res.errno) {
                    alert('Update Successfully！');
                    window.location.reload();
                }
                else alert(res.errmsg);
            }
        });
        const data = this.post();
        return this.fail('23333')
        
      }
  
        return this.display();
        
      };

    /**
       * role
       * 权限管理首页ajax角色列表
       * @returns {Promise|*}
       */
      async updateAction(){//通过post的方式来获取值即可
        let userList = this.model('user');
        let userInfo = await this.session('userInfo');
        let formData = this.post();//获取所有传进来的表单数据
        let affectedRows = await userList.where({user_loginname: userInfo.login}).update({user_name: this.post('inputNickname'),user_mailbox:this.post('inputEmail'),user_tellphone:this.post('inputTell'),user_city:this.post('inputCity')});
        this.success();//此接口的返回值
      }

    /**
       * role
       * 权限管理首页ajax角色列表
       * @returns {Promise|*}
       */
      async applysubmitAction(){//通过post的方式来获取值即可
        if(this.isPost){
          const data = this.post();
          return this.fail('23333')
          
        }
      }
  };
  