resource "aws_instance" "cloudvault" {

  ami = var.ami_id

  instance_type = var.instance_type

  subnet_id = var.subnet_id

  vpc_security_group_ids = [

    var.security_group_id

  ]

  key_name = var.key_name

  associate_public_ip_address = true

  tags = {

    Name = "${var.project_name}-${var.environment}-ec2"

  }

}


resource "aws_eip" "cloudvault" {

  domain = "vpc"

  instance = aws_instance.cloudvault.id

}