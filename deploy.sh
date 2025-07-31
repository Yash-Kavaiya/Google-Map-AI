#!/bin/bash

# GMap-Buddy Cloud Run Deployment Script
# This script automates the deployment of GMap-Buddy to Google Cloud Run

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SERVICE_NAME="gmap-buddy"
REGION="us-central1"
MEMORY="2Gi"
CPU="2"
MAX_INSTANCES="10"
MIN_INSTANCES="0"

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_requirements() {
    print_status "Checking requirements..."
    
    if ! command -v gcloud &> /dev/null; then
        print_error "gcloud CLI is not installed. Please install it first."
        exit 1
    fi
    
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install it first."
        exit 1
    fi
    
    print_success "All requirements satisfied"
}

# Get project ID
get_project_id() {
    PROJECT_ID=$(gcloud config get-value project)
    if [ -z "$PROJECT_ID" ]; then
        print_error "No Google Cloud project set. Run: gcloud config set project YOUR_PROJECT_ID"
        exit 1
    fi
    print_status "Using project: $PROJECT_ID"
}

# Enable required APIs
enable_apis() {
    print_status "Enabling required Google Cloud APIs..."
    gcloud services enable \
        cloudbuild.googleapis.com \
        run.googleapis.com \
        containerregistry.googleapis.com \
        artifactregistry.googleapis.com \
        secretmanager.googleapis.com
    print_success "APIs enabled"
}

# Create secret for Google Maps API key
create_secret() {
    print_status "Setting up Google Maps API key secret..."
    
    if [ -z "$GOOGLE_MAPS_API_KEY" ]; then
        print_warning "GOOGLE_MAPS_API_KEY environment variable not set"
        read -p "Enter your Google Maps API key: " GOOGLE_MAPS_API_KEY
    fi
    
    # Check if secret already exists
    if gcloud secrets describe google-maps-api-key &> /dev/null; then
        print_status "Secret already exists, updating..."
        echo -n "$GOOGLE_MAPS_API_KEY" | gcloud secrets versions add google-maps-api-key --data-file=-
    else
        print_status "Creating new secret..."
        echo -n "$GOOGLE_MAPS_API_KEY" | gcloud secrets create google-maps-api-key --data-file=-
    fi
    
    print_success "Secret configured"
}

# Build and push Docker image
build_and_push() {
    print_status "Building Docker image..."
    
    # Use Cloud Build for better performance and caching
    gcloud builds submit \
        --tag "gcr.io/$PROJECT_ID/$SERVICE_NAME:latest" \
        --timeout=1200s \
        .
    
    print_success "Docker image built and pushed"
}

# Deploy to Cloud Run
deploy_service() {
    print_status "Deploying to Cloud Run..."
    
    gcloud run deploy $SERVICE_NAME \
        --image="gcr.io/$PROJECT_ID/$SERVICE_NAME:latest" \
        --region=$REGION \
        --memory=$MEMORY \
        --cpu=$CPU \
        --max-instances=$MAX_INSTANCES \
        --min-instances=$MIN_INSTANCES \
        --set-env-vars="PORT=8080" \
        --set-secrets="GOOGLE_MAPS_API_KEY=google-maps-api-key:latest" \
        --allow-unauthenticated \
        --execution-environment=gen2 \
        --ingress=all \
        --port=8080 \
        --timeout=300
    
    print_success "Service deployed successfully"
}

# Get service URL
get_service_url() {
    SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --region=$REGION --format="value(status.url)")
    print_success "Service is available at: $SERVICE_URL"
    print_status "You can test the health endpoint at: $SERVICE_URL/health"
}

# Main deployment flow
main() {
    print_status "Starting GMap-Buddy deployment to Cloud Run..."
    
    check_requirements
    get_project_id
    enable_apis
    create_secret
    build_and_push
    deploy_service
    get_service_url
    
    print_success "Deployment completed successfully! 🎉"
    print_status "Your GMap-Buddy application is now running on Google Cloud Run"
}

# Run main function
main "$@"
