<?php

declare(strict_types=1);

namespace ParticleAcademy\AmazonSes\Flow;

use FancyFlow\Attributes\FlowNode;
use FancyFlow\ExecutorRegistry;
use FancyFlow\NodeKindRegistry;
use FancyFlow\Registry\NodeKind;
use ReflectionClass;

/*
 * GENERATED FILE — do not edit.
 *
 * Emitted from provider/actions/ + triggers/ by weaver's generator.
 * A hand-edit here is destroyed by the next protocol sync, which is worse than
 * being rejected, because it works until it silently does not. Fix
 * provider/actions/ + triggers/ (or weaver's template/) and regenerate:
 *
 *     npm run provider -- amazon_ses
 */
/**
 * Every Amazon SES node executor — the PHP twin of `AMAZON_SES_RUNNABLE_KINDS`
 * in @particle-academy/amazon-ses-js.
 *
 * Each class declares its kind in a `#[FlowNode]` attribute. Two ways onto a
 * host:
 *
 * - `AmazonSesFlow::register($kinds, $executors)` — one call, no directory
 * scan.
 * - Laravel: add this directory to `config('fancy-flow.discover')`.
 *
 * Reading the list needs no engine: `::class` is a string and a parameter type
 * is not loaded until the method runs, so this file loads on a host without
 * fancy-flow-php. The executors themselves do not, and are not meant to.
 */
final class AmazonSesFlow
{
    /** @var list<class-string> */
    public const EXECUTORS = [
        EmailSendExecutor::class,
    ];

    /**
     * Register every kind and bind its executor — exactly what fancy-flow-php's
     * discovery does with a class it finds: the kind comes from the class's own
     * `#[FlowNode]`, so there is no second description here to disagree with it.
     *
     * Bound under the canonical name. The executor registry answers to every id a
     * kind declares, so a saved graph using the short alias still finds it.
     */
    public static function register(NodeKindRegistry $kinds, ExecutorRegistry $executors): void
    {
        foreach (self::EXECUTORS as $class) {
            $node = (new ReflectionClass($class))->getAttributes(FlowNode::class)[0]->newInstance();
            $kinds->register(NodeKind::fromArray($node->toKindArray()));
            $executors->bind($node->name, $class);
        }
    }
}
