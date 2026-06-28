output "vpc_id" {
  value = module.network.vpc_id
}

output "public_subnet_id" {
  value = module.network.public_subnet_id
}

output "internet_gateway_id" {
  value = module.network.internet_gateway_id
}
output "ec2_public_ip" {

  value = module.compute.public_ip

}

output "instance_id" {

  value = module.compute.instance_id

}