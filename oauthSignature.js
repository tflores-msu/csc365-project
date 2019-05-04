'use strict'; 
const crypto = require('crypto'),
obj = {


    createSignature: function(options){
        if (typeof options.includeEntities === 'undefined') options.includeEntities = true; 
        if (typeof options.method == 'undefined') options.method = 'POST';
        if (typeof options.returnAllValues == 'undefined') options.returnAllValues = false; 

        let paramString = this.createParameterString(options.oauthObj, options.status, options.includeEntities),
        signatureBase = this.createSignatureBase(options.method, options.baseURL, paramString),
        signingKey = this.createSigningKey(options.oauthObj),
        signature = this.calculateSignature(signingKey, signatureBase);

        if(options.returnAllValues){
            return {
                paramString,
                signatureBase,
                signingKey,
                signature
            };
        } else {
            return sig; 
        }


        

    },

    createParameterString : function(obj, status, includeEntities = 'true'){
        return (
            this.percentEncode('include_entities')          + '=' + this.percentEncode(includeEntities)     + '&' + 
            this.percentEncode('oauth_consumer_key')        + '=' + this.percentEncode(obj.consumerKey)     + '&' + 
            this.percentEncode('oauth_nonce')               + '=' + this.percentEncode(obj.nonce)           + '&' + 
            this.percentEncode('oauth_signature_method')    + '=' + this.percentEncode(obj.signatureMethod) + '&' + 
            this.percentEncode('oauth_timestamp')           + '=' + this.percentEncode(obj.timestamp)       + '&' + 
            this.percentEncode('oauth_token')               + '=' + this.percentEncode(obj.accessToken)     + '&' + 
            this.percentEncode('oauth_version')             + '=' + this.percentEncode(obj.oauthVersion)    + '&' + 
            this.percentEncode('status')                    + '=' + this.percentEncode(status)
        );
    },

    createSignatureBase : function(method = 'post', baseURL, paramString){
        return (
            this.percentEncode(method.toUpperCase()) + '&' + 
            this.percentEncode(baseURL) + '&' +
            this.percentEncode(paramString)
        ); 
    },

    createSigningKey : function(obj){
        return (
            this.percentEncode(obj.consumerSecret) + '&' + 
            this.percentEncode(obj.accessTokenSecret)
        );
    },

    calculateSignature : function(key, base){
        let hmac = crypto.createHmac('sha1', key);
        hmac.update(base);
        return hmac.digest('base64');
    },
    percentEncode : function(str) {
        return encodeURIComponent(str).replace(/!/g, '%21');
    }
}
module.exports = obj; 