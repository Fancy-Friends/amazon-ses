<?php

declare(strict_types=1);

namespace ParticleAcademy\AmazonSes\Flow;

use FancyFlow\Attributes\FlowNode;
use FancyFlow\Contracts\NodeExecutor;
use FancyFlow\Runtime\ExecutionContext;
use FancyFlow\Runtime\Port;
use FancyFlow\Runtime\RunEvent;
use ParticleAcademy\AmazonSes\Actions\EmailSend;
use ParticleAcademy\AmazonSes\AmazonSes;
use ParticleAcademy\Connectors\ConnectorClient;

/*
 * GENERATED FILE — do not edit.
 *
 * Emitted from provider/actions/email-send.json by weaver's generator.
 * A hand-edit here is destroyed by the next protocol sync, which is worse than
 * being rejected, because it works until it silently does not. Fix
 * provider/actions/email-send.json (or weaver's template/) and regenerate:
 *
 *     npm run provider -- amazon_ses
 */
/**
 * Send email, run on a fancy-flow-php host.
 *
 * The PHP twin of `amazonSesEmailSendExecutor` in
 * @particle-academy/amazon-ses-js: the same request, built from the node's
 * config by the same `Actions\EmailSend` a host would call directly, and the
 * same value on `out` — the client's `{data, mode, connection}`.
 *
 * The client resolves the connection and the estate from the config. With
 * nothing configured that is FAKE, so a node dropped on a canvas runs against
 * the faker rather than Amazon SES. To reach a real estate, pass a
 * `ConnectorClient` that knows the host's connections — or bind one in the
 * container, which resolves the constructor by type.
 */
#[FlowNode(
    name: '@particle-academy/amazon_ses_email_send',
    aliases: [
        'amazon_ses_email_send',
    ],
    category: 'io',
    label: 'Send email',
    description: 'Send an email through Amazon SES.',
    icon: '✉',
    inputs: [
        [
            'id' => 'in',
        ],
    ],
    outputs: [
        [
            'id' => 'out',
        ],
    ],
    sideEffects: 'unsafe-to-replay',
    outputShape: [
        [
            'path' => 'mode',
            'type' => 'string',
            'description' => 'Which estate this ran against. SES has no separate one, so: fake or live.',
        ],
        [
            'path' => 'connection',
            'type' => 'string',
            'description' => 'The connection id that was used.',
        ],
        [
            'path' => 'data.MessageId',
            'type' => 'string',
            'description' => 'SES\'s id for the send. It means ACCEPTED, not delivered — and in the sandbox an unverified recipient is accepted and discarded.',
        ],
    ],
)]
final class EmailSendExecutor implements NodeExecutor
{
    public function __construct(private readonly ?ConnectorClient $client = null) {}

    public function execute(ExecutionContext $ctx): mixed
    {
        $config = $ctx->config();

        $result = ($this->client ?? new ConnectorClient)->call(
            AmazonSes::descriptor(),
            EmailSend::OPERATION,
            $config,
            [
                'method' => EmailSend::METHOD,
                'path' => EmailSend::PATH,
                'json' => EmailSend::body($config),
            ],
            $ctx->input('in'),
        );

        $id = is_array($result->data) ? ($result->data['id'] ?? null) : null;
        $ctx->emit(RunEvent::log(
            'info',
            'amazon_ses email_send'.(is_scalar($id) ? ' '.$id : '').' ('.$result->mode->value.')',
            $ctx->node->id,
        ));

        return Port::only('out', $result->toArray());
    }
}
