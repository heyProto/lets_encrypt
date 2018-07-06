// exports.handler = (event, context, callback) => {

  
	var domainBucketPair = {
	  "protograph.pykih.com": "cdn.protograph"
	};

    var letsEncryptApiUrl = "https://acme-v02.api.letsencrypt.org/directory";


	// var domainBucketPair = event.domainBucketPair; 
	var domains = Object.keys(domainBucketPair);
	// var challengeBucket = event.bucket;
	// const letsEncryptApiUrl = event.lets_encrypt_url;

	const configBucket = 'le-store-s3';
	const configDir = "configs"

	const S3 = {
		bucketName: configBucket,
        region: 'us-east-1',
    }
     
    const store = require('le-store-s3').create({ S3 });
    const challenge = require('le-challenge-s3').create({ S3 });
     
    const instance = require('greenlock').create({
        store:store,
        server: letsEncryptApiUrl,
        version:'draft-11',
        challenges: { 'http-01': challenge },
        challengeType: 'http-01',
        agreeToTerms (opts, callback) {
            // callback(null, opts.tosUrl)
        },
        configDir: configDir
    });
    
    console.log("registering");
    
    instance.register({
        domains: domains,
        email: 'xbox2752@gmail.com',
        agreeTos: true,
        rsaKeySize: 2048,
        challengeType: 'http-01',
        domainBucketPair: domainBucketPair
    }).then(function (certs) {
		console.log("certificate");
		console.log(certs);
      	// privkey, cert, chain, expiresAt, issuedAt, subject, altnames
          
      	// upload the certificate
		const AWS = require('aws-sdk');
		var acm = new AWS.ACM({apiVersion: '2015-12-08'});
		var params = {
		    Certificate: certs.cert,
		    PrivateKey: certs.privkey,
		    CertificateChain: certs.chain
		};

      	acm.importCertificate(params, function(err, data) {
        if (err){ 
            console.log("error uploading certifcate");
            console.log(err, err.stack); // an error occurred
            // callback(err);
        }else {
            console.log("Congrats, certificate has been uploaded");
            console.log(data);           // successful response
			// callback(null, {"success": "Congrats, certificate has been uploaded", "arn": data});
        }
      });
    }, function (err) {
        console.error(err);
		// callback(err);
    });
// };