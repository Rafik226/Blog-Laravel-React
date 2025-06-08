<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Newsletter</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
        }
        .container {
            background-color: #ffffff;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #e0e0e0;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .logo {
            font-size: 24px;
            font-weight: bold;
            color: #2563eb;
            text-decoration: none;
        }
        .content {
            margin-bottom: 30px;
        }
        .footer {
            border-top: 1px solid #e0e0e0;
            padding-top: 20px;
            text-align: center;
            font-size: 12px;
            color: #666;
        }
        .unsubscribe-link {
            color: #666;
            text-decoration: none;
        }
        .unsubscribe-link:hover {
            text-decoration: underline;
        }
        h1, h2, h3 {
            color: #2563eb;
        }
        a {
            color: #2563eb;
        }
        .btn {
            display: inline-block;
            padding: 12px 24px;
            background-color: #2563eb;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 10px 0;
        }
        .btn:hover {
            background-color: #1d4ed8;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <a href="{{ url('/') }}" class="logo">Mon Blog</a>
            <p style="margin: 10px 0 0 0; color: #666;">Newsletter</p>
        </div>

        <div class="content">
            {!! $content !!}
        </div>

        <div class="footer">
            <p>
                Vous recevez cet email car vous êtes abonné à notre newsletter.
            </p>
            @if($unsubscribeToken)
            <p>
                <a href="{{ route('newsletter.unsubscribe', $unsubscribeToken) }}" class="unsubscribe-link">
                    Se désabonner de cette newsletter
                </a>
            </p>
            @endif
            <p>
                © {{ date('Y') }} Mon Blog. Tous droits réservés.
            </p>
        </div>
    </div>
</body>
</html>
