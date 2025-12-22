# Odoo Community Edition Installation Guide

This guide will help you install Odoo 17.0 Community Edition in WSL2 (Ubuntu 24.04).

## Prerequisites
- WSL2 with Ubuntu 24.04 (already installed ✓)
- Windows 11 or Windows 10

## Installation Steps

### 1. Open WSL2 Terminal
```bash
wsl
cd /mnt/c/Users/Xrey/Repository/Erp
```

### 2. Update System Packages
```bash
sudo apt-get update
sudo apt-get upgrade -y
```

### 3. Install PostgreSQL
```bash
sudo apt-get install -y postgresql postgresql-client
sudo service postgresql start
```

### 4. Create PostgreSQL User for Odoo
```bash
sudo -u postgres createuser -s odoo
sudo -u postgres psql -c "ALTER USER odoo WITH PASSWORD 'odoo';"
```

### 5. Install System Dependencies
```bash
sudo apt-get install -y \
    python3-pip \
    python3-dev \
    python3-venv \
    libxml2-dev \
    libxslt1-dev \
    libldap2-dev \
    libsasl2-dev \
    libtiff5-dev \
    libjpeg8-dev \
    libopenjp2-7-dev \
    zlib1g-dev \
    libfreetype6-dev \
    liblcms2-dev \
    libwebp-dev \
    libharfbuzz-dev \
    libfribidi-dev \
    libxcb1-dev \
    libpq-dev \
    git \
    node-less \
    npm \
    wkhtmltopdf
```

### 6. Clone Odoo Repository
```bash
git clone https://www.github.com/odoo/odoo --depth 1 --branch 17.0 --single-branch odoo
```

### 7. Create Python Virtual Environment
```bash
python3 -m venv odoo-venv
source odoo-venv/bin/activate
```

### 8. Install Python Dependencies
```bash
pip install --upgrade pip
pip install wheel
pip install -r odoo/requirements.txt
```

### 9. Create Odoo Configuration File
```bash
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
http_port = 8069
EOF
```

### 10. Start Odoo
```bash
# Make sure PostgreSQL is running
sudo service postgresql start

# Activate virtual environment
source odoo-venv/bin/activate

# Start Odoo
python odoo/odoo-bin -c odoo.conf
```

## Accessing Odoo

After starting Odoo, open your web browser and navigate to:
```
http://localhost:8069
```

### First Time Setup
1. Create a new database:
   - Master Password: `admin`
   - Database Name: Choose a name (e.g., `mycompany`)
   - Email: Your admin email
   - Password: Your admin password
   - Language: Select your language
   - Country: Select your country

2. Wait for the database to be created (this may take a few minutes)

3. You'll be redirected to the Odoo main interface

## Quick Start Script

For convenience, create a start script:

```bash
cat > start_odoo.sh << 'EOF'
#!/bin/bash
cd /mnt/c/Users/Xrey/Repository/Erp
sudo service postgresql start
source odoo-venv/bin/activate
python odoo/odoo-bin -c odoo.conf
EOF

chmod +x start_odoo.sh
```

Then you can start Odoo with:
```bash
./start_odoo.sh
```

## Stopping Odoo

Press `Ctrl + C` in the terminal where Odoo is running.

## Troubleshooting

### PostgreSQL not starting
```bash
sudo service postgresql status
sudo service postgresql start
```

### Port 8069 already in use
Check if Odoo is already running:
```bash
ps aux | grep odoo-bin
# Kill the process if needed
kill <process_id>
```

### Database connection errors
Make sure PostgreSQL is running and the credentials in `odoo.conf` match the PostgreSQL user:
```bash
sudo -u postgres psql -c "\du"  # List PostgreSQL users
```

## Default Credentials

- **Master Password**: admin
- **Database User**: odoo
- **Database Password**: odoo
- **PostgreSQL Port**: 5432
- **Odoo Port**: 8069

## Next Steps

1. Explore the Odoo interface
2. Install additional modules from Apps menu
3. Configure your company settings
4. Start customizing Odoo for your needs

## Notes

- The installation script `install_odoo.sh` has been created in this directory
- All data is stored in WSL2, accessible from Windows at: `\\wsl$\Ubuntu-24.04\mnt\c\Users\Xrey\Repository\Erp`
- Logs are written to `odoo.log` in the installation directory
