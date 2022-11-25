module "deployments_overview_page" {
  source            = "git::https://github.com/tomondre/raspberry-kubernetes-cluster.git//terraform-modules/reusable-modules/full-deployment"
  health_check_path = "/"
  image_url         = "docker.io/tomondre/deployments-page"
  service_name      = "deployments"
  port              = 80
  image_tag         = var.image_tag
}

variable "image_tag" {}