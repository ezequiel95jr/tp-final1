<?php

return [

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],
    'resend' => [
        'key' => env('RESEND_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],
    'google' => [
        'client_id' => env('1057987267691-e0vs7jm74ofo6ou9ivn75p77mbhllmrt.apps.googleusercontent.com'),
        'client_id_android' => env('1057987267691-9teg34ut22ioop9u3ppgn9lqtkhi5rbu.apps.googleusercontent.com'),
        #'maps_server_key' => env(''),
],

];
