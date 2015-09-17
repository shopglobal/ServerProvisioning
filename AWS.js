
var AWS = require('aws-sdk');
var fs = require('fs');

AWS.config.update({accessKeyId: '', secretAccessKey: ''});  // Put AWS account access key id and secret access key
  
AWS.config.update({region: 'us-west-1'});

var ec2 = new AWS.EC2();

var params = {
	ImageId: 'ami-a38b4ee7', 
	InstanceType: 't1.micro',
	KeyName: 'HW1',
	MinCount: 1, MaxCount: 1
};


ec2.runInstances(params, function(err, data) {
	if (err) { console.log("Could not create instance", err); return; }

	var instanceId = data.Instances[0].InstanceId;
	console.log("AWS EC2 instance id: ", instanceId);

	var params = {
		InstanceIds: [ instanceId ]
	};

	console.log("waiting for AWS EC2 instance to start");
	var sleep = require('sleep');
	sleep.sleep(90);
	
	ec2.describeInstances(params, function(err, data) {
	if (err) console.log(err, err.stack); // an error occurred
	else{
		console.log("AWS EC2 instance started with ip address:"+ data.Reservations[0].Instances[0].PublicIpAddress);

		var ip = data.Reservations[0].Instances[0].PublicIpAddress;
		fs.appendFile("/home/viral/HW1/inventory", "node1 ansible_ssh_host="+ip+" ansible_ssh_user=ubuntu ansible_ssh_private_key_file=/home/viral/HW1/ansible/keys/testAWSkey.pem\n", function(err) {
			if(err) {
				return console.log(err);
			}else{	console.log("AWS EC2 instance entry done in inventory file");
					console.log("-------------------------------------------------------------------------------------------------------------");
		}

	}); 

	} 
}); 





}); 






