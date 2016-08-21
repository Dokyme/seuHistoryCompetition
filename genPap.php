<?php
function generatePaperArray($amount=200,$n=40,$piece=100,$per=20)
{
    $c=$per*$piece/$amount;
    $quotientSet=array();
    $paper=array();
    $finIndex=array();
    $end=0;

    for ($i=0; $i < $n; $i++) {
        $paper[$i]=array();
    }

    for($i=0;$i<$n;$i++)
    {
        $finIndex[$i]=array();
    }

    for($i=0;$i<$n;$i++)
    {
        $end=$piece-1;
        for($x=0;$x<$piece;$x++)
        {
            $quotientSet[$x]=$x;
        }
        echo "Paper ".$i." : \n";
        for($j=0;$j<$c;$j++)
        {
            $t=rand(0,$end);
            $paper[$i][$j]=$quotientSet[$t];
            for(;$t<$end;$t++)
            {
                $quotientSet[$t]=$quotientSet[$t+1];
            }
            $end--;
            for($k=0;$k<$amount/$piece;$k++)
            {
                echo $paper[$i][$j]*$amount/$piece+$k." ";

            }
            if(($j+1)*$amount/$piece%5==0)
            {
                echo "\n";
            }
        }
        echo "\n";
    }

    for($i=0;$i<$n;$i++)
    {
        echo $i." : ";
        for($j=0;$j<$c;$j++)
        {
            for($k=0;$k<$amount/$piece;$k++)
            {
                $finIndex[$i][$j*$amount/$piece+$k]=$paper[$i][$j]*$amount/$piece+$k;
                echo $finIndex[$i][$j*$amount/$piece+$k]." ";
            }
        }
        echo "\n\n";
    }
    echo "\n";

    return $finIndex;
}

?>
