const LineAPI  = require('./api');
var config = require('./config');
var moment = require('moment');

class LineConnect extends LineAPI {

  constructor(options) {
    super();

    if (typeof options !== 'undefined') {
      this.authToken = options.authToken;
	  this.email = options.email;
	  this.password = options.password;
      this.certificate = options.certificate;
      this.config.Headers['X-Line-Access'] = options.authToken;
    }
  }
  
  getQrFirst() {
    return new Promise((resolve,reject) => {
      this._qrCodeLogin().then(async (res) => {
        this.authToken = res.authToken;
        this.certificate = res.certificate;
        console.info(`[*] Token: ${this.authToken}`);
        console.info(`[*] Certificate: ${res.certificate}`);
        let { mid, displayName } = await this._client.getProfile();config.botmid = mid;
        console.info(`[*] ID: ${mid}`);
        console.info(`[*] Name: ${displayName}`);
        await this._tokenLogin(this.authToken, this.certificate);
		await this._chanConn();
		let icH = await this._channel.issueChannelToken("1341209950");config.chanToken = icH.channelAccessToken;
		let xxc = icH.expiration;let xcc = xxc.toString().split(" ");let xc = xcc.toString();
		let expireCH = moment("/Date("+xc+"-0700)/").toString();
		console.info("[*] ChannelToken: "+icH.channelAccessToken);
		console.info("[*] ChannelTokenExpire: "+expireCH+"\n");
		console.info(`NOTE: Dont forget , put your admin mid on variable 'myBot' in main.js \n`);
        console.info(`Regrads Alfathdirk and thx for TCR Team \n`);
        console.info(`=======LINE AlphatJS (FORK)======\n`);
        resolve();
      });
    });
  }

  async startx () {
    if (this.authToken){
		await this._tokenLogin(this.authToken, this.certificate);
		await this._chanConn();
		let icH = await this._channel.issueChannelToken("1341209950");config.chanToken = icH.channelAccessToken;
		return this.longpoll();
    } else if(this.password && this.email){
		await this._xlogin(this.email,this.password);
		await this._chanConn();
		console.info("Success Login!");
		let icH = await this._channel.issueChannelToken("1341209950");config.chanToken = icH.channelAccessToken;
		return this.longpoll();
	} else {
      return new Promise((resolve, reject) => {
        this.getQrFirst().then(async (res) => {
          resolve(this.longpoll());
        });
      })
    }
  }
  
  fetchOps(rev) {
    return this._fetchOps(rev, 2);
  }

  fetchOperations(rev) {
    return this._fetchOperations(rev, 5);
    
  }

  longpoll() {
    return new Promise((resolve, reject) => {
      this._fetchOps(this.revision, 2).then((operations) => {
        if (!operations) {
          console.log('No operations');
          reject('No operations');
          return;
        }
        return operations.map((operation) => {
              if(operation.revision.toString() != -1) {
                let revisionNum = operation.revision.toString();
                resolve({ revisionNum, operation });
              }
        });
      });
    });
  }

}

module.exports = LineConnect;
