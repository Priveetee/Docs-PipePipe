# Inside BotGuard

When you ask YouTube for a protected stream, the server does not hand over media until your client proves it is running in a genuine browser session. That proof is produced by a piece of code Google ships called BotGuard. It is the hardest part of the whole SABR story to reason about, and this page explains how it is built and why it resists analysis, based on what we observed while studying it.

The point here is to understand the shape of the system, not to reproduce it.

## It is not a normal script

What the browser loads is a small, stable interpreter. That interpreter does not contain the logic directly. Instead it carries a program in a compact encrypted form, and it decrypts that program on the fly while it runs. The decrypted result is not plain JavaScript either. It is bytecode for a little virtual machine that the interpreter implements itself.

So the real logic lives several layers down from anything you can read.

![BotGuard layers](/diagrams/botguard-layers.png)

The interpreter reads the encrypted bytecode, runs it inside its own VM, and the VM eventually produces a snapshot. That snapshot is what the client sends to Google for attestation. It is itself encrypted before it leaves, so even the output is opaque.

## Why it resists analysis

A few design choices stack up and make this much harder than a normal obfuscated script.

The bytecode is encrypted, so you cannot just read the program. The interpreter decrypts it only as it executes, in small pieces, never as one readable blob.

The runtime is regenerated. Each time the challenge runs, the executable form is rebuilt and the internal names change from one run to the next. A breakpoint or a hook that worked once does not line up the next time, because the thing it pointed at no longer exists in the same place.

There is self verification. The snapshot mixes in a measurement of the running code, so if you patch the source to add a log or a hook, the snapshot changes and the server rejects it. You cannot quietly instrument it from the inside.

The VM also looks at its environment. It inspects browser and DOM details, not just simple flags, so faking one or two values is not enough. It is checking that the world around it behaves like a real browser.

Put together, these mean the only reliable way to get a valid result is to let the real challenge run in a real JavaScript environment. Reading the code tells you the structure, but it does not let you shortcut the execution.

## What this means if you integrate SABR

The practical takeaway is simple. A working SABR integration runs the official BotGuard challenge in a JavaScript runtime or a WebView, lets it produce its snapshot, and uses the token that comes back. It does not try to rebuild BotGuard or to forge its output, because the design is built specifically to make that not work.

For what the server does with the snapshot, see [Attestation](./sabr-attestation).
