# Protocol Sign - Frontend

## Overview

Protocol Sign Frontend is a Vue.js-based web application that provides a user-friendly interface for the Protocol Sign digital signature platform. It allows users to manage documents, create and sign contracts, and interact with the blockchain-based backend.

## Tech Stack

- **Framework**: Vue.js 3
- **UI Library**: Element Plus
- **State Management**: Vuex
- **Routing**: Vue Router
- **HTTP Client**: Axios
- **Build Tool**: Vue CLI / Vite
- **Blockchain Interaction**: Ethers.js / Web3.js
- **PDF Rendering**: PDF.js (Note: The original project considered switching to `vue-pdf` to resolve performance issues).

## Project Structure

```
protocolsign-web/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── assets/         # Images, fonts, and styles
│   ├── components/     # Reusable Vue components (Header, Footer, etc.)
│   ├── views/          # Page-level components (Login, Dashboard, Sign, etc.)
│   ├── router/         # Vue Router configuration
│   ├── store/          # Vuex store modules
│   ├── utils/          # Utility functions (HTTP client, Web3 helpers)
│   ├── App.vue         # Root Vue component
│   └── main.js         # Application entry point
├── package.json        # Project dependencies and scripts
├── vue.config.js       # Vue CLI configuration
└── README.md           # This File
```

## Key Features

### 1. User Authentication
- **Email Login**: Register and log in using email and verification code.
- **MetaMask Login**: Connect and authenticate with a MetaMask wallet.
- **Session Management**: Secure session handling with JWT tokens.

### 2. Dashboard
- Overview of recent documents and signature requests.
- Quick access to key features.
- User profile and settings.

### 3. Document Management
- **Upload**: Upload PDF documents for signing.
- **List View**: View, search, and filter all documents.
- **Document Viewer**: Render and display PDF documents within the app.

### 4. Digital Signing Workflow
- **Initiate Signature**: Create a new signature request for a document.
- **Add Signers**: Invite one or more parties to sign.
- **Place Signature**: Drag and drop signature fields onto the document.
- **Sign Document**: Sign by clicking a signature field, which triggers a blockchain transaction.

### 5. Signature Verification
- Verify the authenticity of a signed document.
- Check signature details and transaction history on the blockchain.

## API Integration

The frontend communicates with the `protocol-sign-backend` API for all business logic.

- **API Base URL**: Configured in `src/http.js`
- **Endpoints**: All API calls are managed through the Axios instance.

### Configuration

Update the `baseURL` in `src/http.js` to point to your deployed backend API:

```javascript
// src/http.js

// const baseURL = 'https://www.protocolsign.cn/dsign_api' // Old API
const baseURL = 'https://your-backend-api-url.com/dsign_api' // Change this

axios.defaults.baseURL = baseURL;
```

## Build and Run

### Prerequisites
- Node.js 16+
- pnpm (or npm/yarn)

### Local Development

```bash
# Clone the repository
git clone https://github.com/everest-an/protocol-sign-frontend.git
cd protocol-sign-frontend

# Install dependencies
pnpm install

# Run the development server
pnpm run serve
```

The application will be available at `http://localhost:8081`.

### Production Build

```bash
# Build for production
pnpm run build
```

The production-ready files will be generated in the `dist/` directory.

## Deployment

### Vercel (Recommended)

This project is optimized for deployment on Vercel.

1. **Push to GitHub**: Ensure your code is on a GitHub repository.
2. **Create Vercel Project**: 
   - Go to your Vercel dashboard.
   - Click "Add New..." -> "Project".
   - Import the GitHub repository.
3. **Configure Project**:
   - **Framework Preset**: Vercel will automatically detect it as a Vue.js project.
   - **Build Command**: `pnpm run build` (or `npm run build`)
   - **Output Directory**: `dist`
   - **Install Command**: `pnpm install` (or `npm install`)
4. **Add Environment Variables**:
   - `VUE_APP_API_URL`: The URL of your deployed backend API.
5. **Deploy**: Click the "Deploy" button.

### Other Platforms

You can deploy the contents of the `dist/` directory to any static web hosting service, such as Netlify, AWS S3, or your own server (using Nginx or Apache).

#### Nginx Example Configuration

```nginx
server {
    listen 80;
    server_name protocolsign.net www.protocolsign.net;

    root /var/www/protocol-sign-frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Optional: Proxy API requests to the backend
    location /dsign_api/ {
        proxy_pass http://localhost:8080/dsign_api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

## Troubleshooting

### "Invalid Host header" in Development

If you see this error, add the following to `vue.config.js`:

```javascript
module.exports = {
  devServer: {
    allowedHosts: 'all',
  },
};
```

### Build Fails (Memory Issues)

The project uses large libraries like `pdfjs-dist`. If the build fails due to memory limits, try:

```bash
NODE_OPTIONS=--max_old_space_size=4096 pnpm run build
```

Or deploy via Vercel, which has sufficient build resources.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

Proprietary. All rights reserved.

## Contact

- Website: https://protocolsign.net
- Email: support@protocolsign.net

## Related Repositories

- Backend: [protocol-sign-backend](https://github.com/everest-an/protocol-sign-backend)

---

**Version**: 1.0.0  
**Last Updated**: November 2025
