def sm2(
    quality: int, repetitions: int, ease_factor: float, interval: int
) -> tuple[int, int, float]:
    """SM-2 spaced repetition algorithm.

    Returns (new_repetitions, new_interval_days, new_ease_factor).
    """
    if quality < 3:
        return 0, 1, max(1.3, ease_factor - 0.2)
    if repetitions == 0:
        new_interval = 1
    elif repetitions == 1:
        new_interval = 6
    else:
        new_interval = round(interval * ease_factor)
    new_ef = ease_factor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
    return repetitions + 1, new_interval, max(1.3, new_ef)
