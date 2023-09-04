terraform {
  required_providers {
    aws = {
        source = "hashicorp/aws"
    }
  }
}
provider "aws" {
  region  = "us-east-1"
}

resource "aws_vpc" "myVpc" {
  cidr_block       = "10.0.0.0/16"
  instance_tenancy = "default"

  tags = {
    Name = "main"
  }
}

resource "aws_subnet" "main" {
  vpc_id     = aws_vpc.myVpc.id
  cidr_block = "10.0.1.0/24"
  map_public_ip_on_launch = true

  tags = {
    Name = "Main"
  }
}

resource "aws_internet_gateway" "myIGW" {
  vpc_id = aws_vpc.myVpc.id

  tags = {
    Name = "IGW"
  }
}

data "aws_route_table" "default" {
  route_table_id = aws_vpc.myVpc.default_route_table_id
}

resource "aws_route" "route" {
  route_table_id            = data.aws_route_table.default.id
  destination_cidr_block    = "0.0.0.0/0"
  gateway_id = aws_internet_gateway.myIGW.id
}

resource "aws_network_interface" "my-doc-interface" {
  subnet_id   = aws_subnet.main.id
  security_groups      = [aws_security_group.docker.id]
  tags = {
    Name = "main"
  }
}

resource "aws_network_interface" "my-jek-interface" {
  subnet_id   = aws_subnet.main.id
  security_groups      = [aws_security_group.jenkins.id]
  tags = {
    Name = "main"
  }
}

resource "aws_network_interface" "my-kops-interface" {
  subnet_id   = aws_subnet.main.id
  security_groups      = [aws_security_group.kops.id]
  tags = {
    Name = "main"
  }
}

resource "aws_security_group" "jenkins" {
  name        = "jenkins-sg"
  vpc_id      = aws_vpc.myVpc.id
  description = "Security group for Jenkins"

    ingress {
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }


  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}


resource "aws_security_group" "docker" {
  name        = "docker-sg"
  vpc_id      = aws_vpc.myVpc.id
  description = "Security group for Docker"

  ingress {
    from_port   = 9000
    to_port     = 9000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port       = 0
    to_port         = 0
    protocol        = "-1"
    security_groups = [aws_security_group.jenkins.id]
  }

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "kops" {
  name        = "kops-sg"
  vpc_id      = aws_vpc.myVpc.id
  description = "Security group for Docker"

  ingress {
    from_port       = 0
    to_port         = 0
    protocol        = "-1"
    security_groups = [aws_security_group.jenkins.id]
  }

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}


resource "aws_instance" "jenkins-master" {
  ami           = var.ami_id
  instance_type = "t2.micro"
  key_name      = "cicd"
  network_interface {
    network_interface_id = aws_network_interface.my-jek-interface.id
    device_index         = 0
  }

  tags = {
    Name = "jenkins-cicd"
  }
}

resource "aws_instance" "docker-server" {
  ami           = var.ami_id
  instance_type = "t2.micro"
  key_name      = "cicd"
  network_interface {
    network_interface_id = aws_network_interface.my-doc-interface.id
    device_index         = 0
    
  }

  tags = {
    Name = "docker-server-cicd"
  }
}

resource "aws_instance" "kops" {
  ami           = var.ami_id
  instance_type = "t2.micro"
  key_name      = "cicd"
  network_interface {
    network_interface_id = aws_network_interface.my-kops-interface.id
    device_index         = 0
    
  }

  tags = {
    Name = "kops-cicd"
  }
}

output "jenkins_master_ip" {
  description = "Public IP of the Jenkins Master instance"
  value       = aws_instance.jenkins-master.public_ip
}

output "docker_server_ip" {
  description = "Public IP of the Docker Server instance"
  value       = aws_instance.docker-server.public_ip
}

output "kops_ip" {
  description = "Public IP of the kops instance"
  value       = aws_instance.kops.public_ip
}

