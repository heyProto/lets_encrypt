# README #

This README would document whatever steps are necessary to get your application up and running.

### What is this repository for? ###

* This repo can be used to obtain SSL certificates from Lets Encrypt and upload it to ACM

### For Starters ###
* To obtain certificates for a domain/website, we need to prove to Lets Encrypt that we own the domain/website respectively
* How do we prove?Lets Encrypt gives a challenge that we need to complete
* To obtain certificate for a website, Lets Encrypt gives an HTTP chellenge(random_string_1, random_string_2). We must add a file(file_name=random_string_1, file_content=random_string_2) at the path http://website_root_url/.well-known/acme-challenge However if you have bucket associated with your website then this repo will automatically upload the file at the correct path for you
* To obtain certificate for a domain(wildcard certificate), Lets Encrypt gives a DNS challenge(random string). We must add a CNAME record(value=random string) in our domain control panel.

### How do I get set up? ###

	* Clone this repo
	* In index.js
		1. domainBucketPair = {
			key: val
		}
		key=website_root_url (without http/https, etc)
		val=bucket name associated with your website
		You can add as many (key, val) pairs as you want

		2. letsEncryptApiUrl
			Production Url
			https://acme-v02.api.letsencrypt.org/directory
				for production
				real certificates

			Staging Url	
			https://acme-staging-v02.api.letsencrypt.org/directory
				for development
				fake certificates
			If you request too many certificates for the same domain with production url, lets encrypt may deny to provide certificate. Use staging Url to test

		3. rsaKeySize
			2048 , 4096

		4. email
			your email id	

		5. configBucket
			You should have a bucket created already with name same as the value of this variable. Ofcourse you can change the value of this variable

		6. In register function you can pass additional parameters say my_paramter (just like domainBucketPair is passed as an additional parameter). To know how to access it, keep reading	

	* In node_modules/le-challenge-s3/lib/index.js class=Challenge
		1. set function
			challengePath = file name of http challenge (FYI)
			keyAuthorization = file content of http challenge (FYI)

			This function puts the file in the bucket. It has been modified to meet the requirements. You can modify to fit your requirements

			Note: args.my_paramter will fetch the additional parameter you passed earlier
	* To use it with lambda function
		Read the code comments in index.js
		Comment and Uncomment as instructed

Warning!
Do not run npm install. Modifications made to the library code will be overwritten		

