locals {

  common_tags = {

    Project = var.project_name

    Environment = var.environment

    ManagedBy = "Terraform"

  }

}

module "network" {

  source = "./modules/network"

  project_name = var.project_name

  environment = var.environment

  vpc_cidr = var.vpc_cidr

  public_subnet_cidr = var.public_subnet_cidr

  availability_zone = var.availability_zone
}
module "security" {

  source = "./modules/security"

  project_name = var.project_name

  environment = var.environment

  vpc_id = module.network.vpc_id

}

module "compute" {

  source = "./modules/compute"

  project_name = var.project_name

  environment = var.environment

  instance_type = var.instance_type

  subnet_id = module.network.public_subnet_id

  security_group_id = module.security.security_group_id

  ami_id = var.ami_id

  key_name = var.key_name

}