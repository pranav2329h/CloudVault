output "instance_id" {

  value = aws_instance.cloudvault.id

}

output "public_ip" {

  value = aws_eip.cloudvault.public_ip

}