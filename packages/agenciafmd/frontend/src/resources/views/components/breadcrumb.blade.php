@props([
'list',
])

<nav aria-label="breadcrumb" {{ $attributes }}>
    <ol class="breadcrumb">
        @foreach ($list as $title => $link)
            @if(!$loop->last)
                <li class="breadcrumb-item"><a href="{{ $link }}">{{ $title }}</a></li>
            @else
                <li class="breadcrumb-item active" aria-current="page">{{ $title }}</li>
            @endif
        @endforeach
    </ol>
</nav>

{{-- Example:
    @php
        $breadcrumb = [
            'Home' => '/html',
            'Produtos' => '/html/produtos',
            'Categoria 1' => '/html/produtos/categoria-1',
            'Nome do produto' => '',
        ];
    @endphp
    <x-frontend::breadcrumb :list="$breadcrumb" class="py-2"/>
--}}
