terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "ap-south-1"
}

variable "github_token" {
  type      = string
  sensitive = true
}

variable "openai_api_key" {
  type      = string
  sensitive = true
}

variable "groq_api_key" {
  type      = string
  sensitive = true
}

variable "perplexity_api_key" {
  type      = string
  sensitive = true
}

variable "next_public_clerk_publishable_key" {
  type = string
}

variable "clerk_secret_key" {
  type      = string
  sensitive = true
}

resource "aws_amplify_app" "ai_fiesta" {
  name       = "ai-fiesta-chat"
  repository = "https://github.com/Ashishds/AI-Fiesta-Chat"
  
  # OAuth token or PAT required for Amplify to connect to GitHub
  access_token = var.github_token

  # Next.js Build Settings
  build_spec = <<-EOT
    version: 1
    frontend:
      phases:
        preBuild:
          commands:
            - npm ci
        build:
          commands:
            - npm run build
      artifacts:
        baseDirectory: .next
        files:
          - '**/*'
      cache:
        paths:
          - node_modules/**/*
  EOT

  # Environment Variables
  environment_variables = {
    OPENAI_API_KEY                    = var.openai_api_key
    GROQ_API_KEY                      = var.groq_api_key
    PERPLEXITY_API_KEY                = var.perplexity_api_key
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = var.next_public_clerk_publishable_key
    CLERK_SECRET_KEY                  = var.clerk_secret_key
  }

  # Enable Next.js Framework
  platform = "WEB_COMPUTE"
}

resource "aws_amplify_branch" "main" {
  app_id      = aws_amplify_app.ai_fiesta.id
  branch_name = "main"
  framework   = "Next.js - SSR"
  stage       = "PRODUCTION"

  enable_auto_build = true
}

resource "aws_amplify_domain_association" "domain" {
  app_id      = aws_amplify_app.ai_fiesta.id
  domain_name = "ashishgenai.online"

  # Subdomain settings
  sub_domain {
    branch_name = aws_amplify_branch.main.branch_name
    prefix      = ""
  }

  sub_domain {
    branch_name = aws_amplify_branch.main.branch_name
    prefix      = "www"
  }
}
