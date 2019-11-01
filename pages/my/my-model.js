import { MemberBase } from '../../utils/memberApi.js';

class My extends MemberBase {
  constructor() {
    super();
  }

  userInfo(callback) {
    var params = {
      url: '/l/v1/user/info',
      sCallback: function (res) {
        callback && callback(res);
        // console.log(res)
      }
    }
    this.request(params);
  }
}

export { My };