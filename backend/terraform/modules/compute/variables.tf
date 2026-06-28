variable "project_name" {
  type = string
}

variable "environment" {
  type = string
}

variable "instance_type" {
  type = string
}

variable "subnet_id" {
  type = string
}

variable "security_group_id" {
  type = string
}

variable "ami_id" {
  description = "Ubuntu AMI ID"
  type        = string
}

variable "key_name" {
  description = "EC2 Key Pair Name"
  type        = string
}