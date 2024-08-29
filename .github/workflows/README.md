        gcloud compute networks list


        gcloud compute networks create smartbot-network

        gcloud compute networks subnets create smartbot-subnet \

--range=10.124.0.0/28 --network=smartbot-network --region=us-central1

gcloud compute networks vpc-access connectors create smartbot-connector \
 --region=us-central1 \
 --subnet-project=smartbot-413622 \
 --subnet=smartbot-subnet

gcloud compute routers create smartbot-router \
 --network=smartbot-network \
 --region=us-central1

gcloud compute addresses create smartbot-ip --region=us-central1

gcloud compute routers nats create smartbot-nat \
 --router=smartbot-router \
 --region=us-central1 \
 --nat-custom-subnet-ip-ranges=smartbot-subnet \
 --nat-external-ip-pool=smartbot-ip
