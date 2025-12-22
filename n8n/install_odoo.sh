#!/bin/bash

set -e

echo "=========================================="
echo "Odoo Community Edition Installation Script"
echo "=========================================="
echo ""

# Update system packages
echo "Step 1: Updating system packages..."
sudo DEBIAN_FRONTEND=noninteractive apt-get update -qq

# Install PostgreSQL
echo "Step 2: Installing PostgreSQL..."
sudo DEBIAN_FRONTEND=noninteractive apt-get install -y postgresql postgresql-client

# Install system dependencies for Odoo
echo "Step 3: Installing system dependencies..."
sudo DEBIAN_FRONTEND=noninteractive apt-get install -y python3-pip python3-dev python3-venv libxml2-dev libxslt1-dev libldap2-dev libsasl2-dev libtiff5-dev libjpeg8-dev libopenjp2-7-dev zlib1g-dev libfreetype6-dev liblcms2-dev libwebp-dev libharfbuzz-dev libfribidi-dev libxcb1-dev libpq-dev git node-less npm wkhtmltopdf

# Start PostgreSQL service
echo "Step 4: Starting PostgreSQL service..."
sudo service postgresql start

# Create Odoo PostgreSQL user
echo "Step 5: Creating Odoo PostgreSQL user..."
sudo -u postgres psql -c "CREATE USER odoo WITH CREATEDB PASSWORD 'odoo';" 2>&1 | grep -v "already exists" || echo "User 'odoo' already exists"

# Clone Odoo Community Edition
echo "Step 6: Downloading Odoo Community Edition..."
if [ ! -d "odoo" ]; then
    git clone https://www.github.com/odoo/odoo --depth 1 --branch 17.0 --single-branch odoo
    echo "Odoo 17.0 Community Edition downloaded successfully"
else
    echo "Odoo directory already exists, skipping clone"
fi

# Create Python virtual environment
echo "Step 7: Creating Python virtual environment..."
if [ ! -d "odoo-venv" ]; then
    python3 -m venv odoo-venv
    echo "Virtual environment created"
else
    echo "Virtual environment already exists"
fi

# Activate virtual environment and install Python dependencies
echo "Step 8: Installing Python dependencies..."
source odoo-venv/bin/activate
pip install --upgrade pip
pip install wheel
pip install -r odoo/requirements.txt

# Create Odoo configuration file
echo "Step 9: Creating Odoo configuration file..."
cat > odoo.conf << 'EOF'
[options]
admin_passwd = admin
db_host = localhost
db_port = 5432
db_user = odoo
db_password = odoo
addons_path = odoo/addons
logfile = odoo.log
log_level = info
EOF

echo ""
echo "=========================================="
echo "Installation completed successfully!"
echo "=========================================="
echo ""
