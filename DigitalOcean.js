var needle = require("needle");
var os   = require("os");
var fs = require('fs');

var config = {};
config.token = ""; // Put DigitalOcean token here

var headers =
{
	'Content-Type':'application/json',
	Authorization: 'Bearer ' + config.token
};

var client =
{
	
	createDroplet: function (dropletName, region, imageName, onResponse)
	{
		var data = 
		{
			"name": dropletName,
			"region":region,
			"size":"512mb",
			"image":imageName,
			"ssh_keys":[1350427],
			"backups":false,
			"ipv6":false,
			"user_data":null,
			"private_networking":null
		};

		needle.post("https://api.digitalocean.com/v2/droplets", data, {headers:headers,json:true}, onResponse );
	},

    getDropletInfo: function(dropletId, onResponse )
	{
		needle.get("https://api.digitalocean.com/v2/droplets/"+dropletId, {headers:headers}, onResponse)
	}
};


var name = "vjsangha"+os.hostname();
var region = "nyc1"; 
var image = " 13089493"; 

var dropletId = "";
client.createDroplet(name, region, image, function(err, resp, body)
{

	if(!err && resp.statusCode == 202)
	{
		console.log("-------------------------------------------------------------------------------------------------------------");
		console.log("Droplet id = "+ body.droplet.id);
		dropletId = body.droplet.id;

		console.log("waiting for DigitalOcean instance to start");
		var sleep = require('sleep');
	        sleep.sleep(90);
		

		var ip = ""; 
client.getDropletInfo(dropletId,function(error, response)
{
	var data = response.body;
	ip = data.droplet.networks.v4[0].ip_address;
	console.log("DigitalOcan instance started with ip address:"+ ip);

	fs.writeFile("/home/viral/HW1/inventory", "[Servers]\nnode0 ansible_ssh_host="+ip+" ansible_ssh_user=root ansible_ssh_private_key_file=/home/viral/HW1/ansible/keys/testkey.key\n", function(err) {
	if(err) {
        	return console.log(err);
	}
	console.log("DigitalOcean instance entry done in inventory file");
	console.log("-------------------------------------------------------------------------------------------------------------");
	}); 

}); 


	}
});
