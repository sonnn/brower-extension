import {sendFunctionCall} from "shared/communication";
import {settingStorage} from "shared/storage";

var defaultSetting = require("./setting");


var ComponentSettingPagePanel = Vue.extend({
    template: require("./template.html"),
    data: function(){
        return getDefaultData(defaultSetting);
    },
    attached: function(){
        require("./style.less");
    },
    methods: {
        initUpdate: async function(){
            try{
                var def = getDefaultData(defaultSetting);
                var storageSetting = await settingStorage.get(def);
                _.forEach(storageSetting, (val, key) => {
                    this[key] = val;
                })
                return Promise.resolve(true);
            }catch(e){
                console.log(e);
                return Promise.reject();
            }
        },
        startWatching: function(){
            _.forEach(defaultSetting, (opt, key) => {
                this.$watch(key, (newVal) => {
                    var val = newVal;
                    if(opt.validateOnInput) val = opt.validateOnInput(val);
                    this.updateSetting(key, val);
                })
            })
        },
        updateSetting: function(key, val){
            settingStorage.set(key, val);
        }
    },
    created: async function(){
        await this.initUpdate();
        this.startWatching();
    }
});

export default ComponentSettingPagePanel

function getDefaultData(setting){
    var data = {};
    _.forEach(setting, (val, key) => {
        data[key] = val.def;
    })
    return data;
}
