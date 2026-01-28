<!doctype html>
<html lang="${locale.currentLanguageTag}">
    <head>
        <title>${msg("emailTitle")}</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1">
        <base target="_blank">
        
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet">

        <style>
            body {
                background-color: #F0F1F3;
                font-family: 'Inter', Helvetica, Arial, sans-serif;
                font-size: 15px;
                line-height: 26px;
                margin: 0;
                color: #444;
            }

            h1, h2, h3, h4, h5, h6 {
                font-family: 'Space Grotesk', 'Helvetica Neue', Helvetica, sans-serif;
                color: #111;
                font-weight: 700;
                margin-top: 0;
            }

            pre {
                background: #f4f4f4;
                padding: 10px;
                border-radius: 4px;
                overflow-x: auto;
            }

            table {
                width: 100%;
                border: 1px solid #ddd;
                border-collapse: collapse;
            }
            table td {
                border: 1px solid #ddd;
                padding: 8px;
            }

            .wrap {
                background-color: #fff;
                padding: 40px;
                max-width: 525px;
                margin: 0 auto;
                border-radius: 8px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.05);
            }

            .brand-header {
                text-align: center;
                margin-bottom: 30px;
            }
            .brand-header img {
                width: 96px;
                height: 96px;
            }
            .brand-logo-text {
                font-family: 'Space Grotesk', sans-serif;
                font-weight: 700;
                font-size: 24px;
                color: #694BB4;
                text-decoration: none;
                letter-spacing: -0.5px;
            }

            .button {
                background: #694BB4;
                border-radius: 6px;
                text-decoration: none !important;
                color: #fff !important;
                font-family: 'Space Grotesk', sans-serif;
                font-weight: 700;
                padding: 12px 30px;
                display: inline-block;
                margin: 10px 0;
                transition: background 0.3s ease;
            }
            .button:hover {
                background: #533991; 
            }

            .text-success { color: #69D384; font-weight: bold; }
            .text-error { color: #D77585; font-weight: bold; }
            
            .footer {
                text-align: center;
                font-size: 13px;
                color: #888;
                margin-top: 20px;
                font-family: 'Inter', sans-serif;
            }
            .footer a {
                color: #888;
                text-decoration: underline;
                margin: 0 5px;
            }
            .footer-links {
                margin-bottom: 15px;
            }
            .footer-links a {
                color: #694BB4;
                text-decoration: none;
                font-weight: 600;
                font-family: 'Space Grotesk', sans-serif;
            }

            .gutter {
                padding: 30px;
            }

            img {
                max-width: 100%;
                height: auto;
                border-radius: 4px;
            }

            a {
                color: #694BB4;
                text-decoration: none;
                font-weight: 500;
            }
            a:hover {
                text-decoration: underline;
            }

            @media screen and (max-width: 600px) {
                .wrap {
                    max-width: auto;
                    padding: 20px;
                    border-radius: 0;
                }
                .gutter {
                    padding: 10px;
                }
            }
        </style>
    </head>
<body style="background-color: #F0F1F3; font-family: 'Inter', Helvetica, Arial, sans-serif; font-size: 15px; line-height: 26px; margin: 0; color: #444;">
    
    <div class="gutter">&nbsp;</div>
    
    <div class="wrap">
        <div class="brand-header">
            <img src="https://cdn.helpwave.de/logo/logo.png" alt="helpwave logo" />
            <br>
            <a href="https://helpwave.de" class="brand-logo-text">helpwave</a>
        </div>

        <#nested>
    </div>
    
    <div class="footer">
        <div class="footer-links">
            <a href="https://helpwave.de">${msg("website")}</a> •
            <a href="https://status.helpwave.de">${msg("status")}</a> •
            <a href="mailto:contact@helpwave.de">${msg("support")}</a>
        </div>

        <p style="margin-bottom: 10px;">
            ${msg("imprint")}: helpwave GmbH • Jülicher Straße 209q-s • 52070 Aachen • HRB 27480 Aachen
        </p>
        <p>
            <a href="${unsubscribeUrl}">${msg("unsubscribe")}</a>
            &nbsp;|&nbsp;
            <a href="${messageUrl}">${msg("viewInBrowser")}</a>
        </p>
    </div>

    <div class="gutter">${trackView}</div>
</body>
</html>